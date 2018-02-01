import * as parser from 'body-parser';

import { Request, Response, NextFunction, Router } from 'express';
import * as request from 'request';
import * as Stripe from 'stripe';

import { ThirdPartyError, ValidationError } from '../middleware/error-handler';

import { AuthenticationController } from './authentication';

import { IRestOperation } from '../models/rest';

import { environment } from '../config';
import { PlanModel } from '../models/plans';

const stripe = new Stripe(environment.stripe);

export class SubscriptionController extends AuthenticationController {

    public router: Router;

    constructor() {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router = Router();
        this.router.use(parser.json({ type: 'application/json' }));

        this.router.get('/', this.validate.bind(this), this.getSubscription.bind(this));
        this.router.patch('/', this.validate.bind(this), this.updateSettings.bind(this), this.getSubscription.bind(this));
        this.router.get('/plans', this.validate.bind(this), this.getPlans.bind(this));
        this.router.post('/payment', this.validate.bind(this), this.attachPayment.bind(this), this.getSubscription.bind(this));
        this.router.post('/gateway', this.validate.bind(this), this.attachGateway.bind(this), this.getSubscription.bind(this));
    }

    getPlans(req: Request, res: Response, next: NextFunction) {
        const order = { name: 1 };

        PlanModel.count(null).exec()
            .then((total) =>
                PlanModel
                    .aggregate([
                        { $sort: order },
                        { $project: { reference: 1, name: 1, currency: 1, price: 1, interval: 1, frequency: 1 } }
                    ])
                    .then((list) => res.status(200).send({ list, total }))
            )
            .catch((planError) => next(planError));
    }

    attachPayment(req: Request, res: Response, next: NextFunction) {
        const errors = [];

        if (!req.body.email) {
            errors.push({ path: 'email', kind: 'required' });
        }

        if (!req.body.plan) {
            errors.push({ path: 'plan', kind: 'required' });
        }

        if (!req.body.token || !req.body.token.id) {
            errors.push({ path: 'token', kind: 'required' });
        }

        if (errors.length) {
            return next(new ValidationError(errors));
        }

        const promise = new Promise((resolve, reject) => {
            if (this.account.subscription.payment && this.account.subscription.payment.customer) {
                stripe.subscriptions
                    .create({
                        customer: this.account.subscription.payment.customer,
                        plan: req.body.plan,
                        quantity: 20,
                        source: req.body.token.id
                    })
                    .then((subscription) => resolve(subscription))
                    .catch((error) => reject(error));
            } else {
                stripe.customers
                    .create({
                        email: req.body.email,
                        plan: req.body.plan,
                        quantity: 20,
                        source: req.body.token.id
                    })
                    .then((customer) => resolve(customer.subscriptions.data[0]))
                    .catch((error) => reject(error));
            }
        });

        promise
            .then((subscription: any) => {
                this.account.subscription.transactions.rate = 0.021;

                this.account.subscription.payment = {
                    customer: subscription.customer,
                    subscription: subscription.id,
                    package: subscription.plan.id,
                    price: {
                        currency: subscription.plan.currency,
                        quantity: subscription.quantity,
                        value: subscription.plan.amount
                    },
                    term: new Date(subscription.current_period_end * 1000),
                    status: subscription.status
                };

                return this.account.subscription.save();
            })
            .then(() => next())
            .catch((err) => next(new ThirdPartyError(err.type, err.message)));
    }

    attachGateway(req: Request, res: Response, next: NextFunction) {
        if (!this.account.subscription || this.account.subscription.gateway) {
            return next();
        }

        const errors = [];

        if (!req.body.reference) {
            errors.push({ path: 'reference', kind: 'required' });
        }

        if (errors.length) {
            return next(new ValidationError(errors));
        }

        const promise = new Promise((resolve, reject) => {
            request.post({
                uri: 'https://connect.stripe.com/oauth/token',
                json: {
                    client_secret: environment.stripe,
                    code: req.body.reference,
                    grant_type: 'authorization_code'
                }
            }, (error, response, body) => (response.statusCode !== 200) ? reject(body) : resolve(body));
        });

        promise
            .then((gateway: { stripe_user_id: string, refresh_token: string, stripe_publishable_key: string, access_token: string }) => {
                this.account.subscription.status = 'ACTIVE';

                this.account.subscription.gateway = {
                    account: gateway.stripe_user_id,
                    refreshToken: gateway.refresh_token,
                    publicKey: gateway.stripe_publishable_key,
                    privateKey: gateway.access_token,
                    modified: new Date()
                };

                return this.account.subscription.save();
            })
            .then(() => next())
            .catch((err) => next(new ThirdPartyError('StripeInvalidRequestError', err.error_description)));
    }

    updateSettings(req: Request, res: Response, next: NextFunction) {
        if (req.body instanceof Array === false) {
            return next();
        }

        (<Array<IRestOperation>>req.body).forEach((operation) => {
            switch (operation.op) {
                case 'replace':
                    switch (operation.path) {
                        case 'storeName':
                            if (!operation.value) {
                                return next(new ValidationError([{ path: 'storeName', kind: 'required' }]));
                            }
                        /* falls through */
                        case 'strapline':
                        case 'icon':
                        case 'logo':
                            this.account.subscription[operation.path] = operation.value;
                    }
            }
        });

        this.account.subscription.save()
            .then(() => next())
            .catch((error) => next(error));
    }

}

export default new SubscriptionController().router;
