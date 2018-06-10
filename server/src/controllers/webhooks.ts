import * as parser from 'body-parser';

import { Request, Response, NextFunction, Router } from 'express';
import * as Stripe from 'stripe';

import { NotFoundError, ThirdPartyError } from '../middleware/error-handler';

import { environment } from '../config';
import { PlanModel } from '../models/plans';
import { SubscriptionModel } from '../models/subscription';
import { OrderModel } from '../models/orders';
import { OrderHistoryModel } from '../models/order-history';

const stripe = new Stripe(environment.stripe);

interface StripeWebhook {
    type: string;
    account?: string;
    data: any;
}

export class WebhookController {

    public router: Router;

    constructor() {
        this.router = Router();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.use(parser.raw({ type: '*/*' }));
        this.router.post('/stripe', this.actionStripeHook.bind(this));
        this.router.post('/connect', this.actionConnectHook.bind(this));
    }

    actionStripeHook(req: Request, res: Response, next: NextFunction) {
        const signature = req.headers['stripe-signature'];

        const promise = new Promise((resolve, reject) => {
            try {
                const event: StripeWebhook = stripe.webhooks.constructEvent(req.body, signature, environment.stripeWebhooks);

                const type = event.type;
                const data = event.data.object;

                resolve({ type, data });
            } catch (error) {
                reject(error);
            }
        });

        promise
            .catch((error) => { throw new ThirdPartyError(error.type, error.message); })
            .then((payload: StripeWebhook): any => {
                switch (payload.type) {
                    case 'plan.created':
                        const planData = {
                            reference: payload.data.id,
                            name: payload.data.nickname,
                            currency: payload.data.currency,
                            price: payload.data.amount,
                            interval: payload.data.interval_count,
                            frequency: payload.data.interval
                        };
                        return PlanModel.findOne({ reference: payload.data.id })
                            .then((plan) => !plan ? PlanModel.create(planData) : null);

                    case 'plan.deleted':
                        return PlanModel
                            .findOne({ reference: payload.data.id })
                            .then((plan) => plan ? plan.remove() : null);

                    case 'customer.subscription.deleted':
                        return SubscriptionModel.findOne({ 'payment.customer': payload.data.customer, 'payment.subscription': payload.data.id })
                            .then((subscription) => subscription ? subscription.update({
                                $unset: {
                                    'payment.subscription': 1,
                                    'payment.package': 1,
                                    'payment.price': 1
                                },
                                $set: {
                                    'transactions.rate': 0.046,
                                    'payment.status': 'CANCELED',
                                    'payment.term': new Date(payload.data.canceled_at * 1000)
                                }
                            }).then(() => subscription) : null);

                    default:
                        console.log(`Ignored stripe hook for "${payload.type}"`);
                }

            })
            .then((record: any) => res.status(200).send({ result: record ? record._id : 'skipped' }))
            .catch((error) => next(error));
    }

    actionConnectHook(req: Request, res: Response, next: NextFunction) {
        const signature = req.headers['stripe-signature'];

        const promise = new Promise((resolve, reject) => {
            try {
                const event: StripeWebhook = stripe.webhooks.constructEvent(req.body, signature, environment.stripeConnect);

                const type = event.type;
                const account = event.account;
                const data = event.data.object;

                resolve({ type, account, data });
            } catch (error) {
                reject(error);
            }
        });

        promise
            .catch((error) => { throw new ThirdPartyError(error.type, error.message); })
            .then((payload: StripeWebhook): any => {
                switch (payload.type) {
                    case 'account.application.deauthorized':
                        return SubscriptionModel
                            .findOne({ 'gateway.account': payload.account })
                            .then((subscription) => subscription ? subscription.update({ status: 'INACTIVE', $unset: { gateway: 1 } }).exec().then(() => subscription) : null);

                    case 'charge.succeeded':
                        return OrderModel.findOne({ 'payment.reference': payload.data.id })
                            .populate({ path: 'history' })
                            .then((order) => {
                                if (!order) {
                                    throw new NotFoundError();
                                }

                                if (order.status === 'CREATED') {
                                    const history = new OrderHistoryModel({ field: 'status', previous: 'CREATED', next: 'AUTHORISED' });
                                    return Promise.resolve()
                                        .then(() => history.save())
                                        .then(() => order.history.unshift(history))
                                        .then(() => order.set('status', 'AUTHORISED').save());
                                } else {
                                    return order;
                                }
                            });

                    case 'charge.refunded':
                        return OrderModel.findOne({ 'payment.reference': payload.data.id })
                            .populate({ path: 'history' })
                            .then((order) => {
                                if (!order) {
                                    throw new NotFoundError();
                                }

                                if (order.status !== 'REFUNDED') {
                                    return Promise.resolve()
                                        .then(() => {
                                            if (payload.data.amount === payload.data.amount_refunded) {
                                                const history = new OrderHistoryModel({ field: 'status', previous: order.status, next: 'REFUNDED' });
                                                return history.save()
                                                    .then(() => order.history.unshift(history))
                                                    .then(() => order.set('status', 'REFUNDED'));
                                            }
                                        })
                                        .then(() => order.set('payment.refund', payload.data.amount_refunded))
                                        .then(() => order.save())
                                        .then(() => SubscriptionModel.findById(order.subscription))
                                        .then((subscription) => {
                                            const stripeConnect = new Stripe(subscription.gateway.privateKey);

                                            return Promise.resolve()
                                                .then(() => {
                                                    if (payload.data.amount === payload.data.amount_refunded) {
                                                        return stripe.applicationFees.createRefund(payload.data.application_fee);
                                                    } else {
                                                        const amount = Math.round(payload.data.refunds.data[0].amount * subscription.transactions.rate);
                                                        return stripe.applicationFees.createRefund(payload.data.application_fee, { amount }).catch((error) => console.log(error.message));
                                                    }
                                                })
                                                .then((fee) => stripeConnect.balance.retrieveTransaction(<string> payload.data.refunds.data[0].balance_transaction).then((transaction) => ({ transaction, fee })))
                                                .then(({ transaction, fee }) => order.update({
                                                    $inc: {
                                                        'payment.fee.total': transaction.fee + (fee ? -fee.amount : 0),
                                                        'payment.fee.venzra.refund': fee ? fee.amount : 0,
                                                        'payment.fee.gateway.refund': -transaction.fee
                                                    }
                                                }));
                                        })
                                        .then(() => order.save());
                                } else {
                                    return order;
                                }
                            });

                    default:
                        console.log(`Ignored connect hook for "${payload.type}"`);
                }

            })
            .then((record: any) => res.status(200).send({ result: record ? record._id : 'skipped' }))
            .catch((error) => next(error));
    }

}

export default new WebhookController().router;
