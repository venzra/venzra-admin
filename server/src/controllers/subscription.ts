import { Request, Response, NextFunction, Router } from 'express';
import * as Stripe from 'stripe';

import { ThirdPartyError, ValidationError } from '../middleware/error-handler';

import { AuthenticationController } from './authentication';

import { IRestOperation } from '../models/rest';

import { environment } from '../config';
import { PlanModel } from '../models/plans';

const stripe = new Stripe(environment.stripe);

class SubscriptionController extends AuthenticationController {

    constructor(private router: Router) {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/plans', this.validate.bind(this), this.getPlans.bind(this));
        this.router.get('/subscription', this.validate.bind(this), this.getSubscription.bind(this));
        this.router.patch('/subscription', this.validate.bind(this), this.updateSettings.bind(this), this.getSubscription.bind(this));
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
        if (!this.account.subscription || this.account.subscription.payment) {
            return next();
        }

        let errors = [];

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

        stripe.customers
            .create({
                email: req.body.email,
                card: req.body.token.id,
                plan: req.body.plan,
                quantity: 20
            })
            .then((customer) => {
                this.account.subscription.status = 'ACTIVE';

                this.account.subscription.payment = {
                    customer: customer.id,
                    subscription: customer.subscriptions.data[0].id,
                    package: customer.subscriptions.data[0].plan.id,
                    price: {
                        currency: customer.subscriptions.data[0].plan.currency,
                        quantity: customer.subscriptions.data[0].quantity,
                        value: customer.subscriptions.data[0].plan.amount
                    }
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

        let errors = [];

        if (!req.body.email) {
            errors.push({ path: 'email', kind: 'required' });
        }

        if (!req.body.token || !req.body.token.id) {
            errors.push({ path: 'token', kind: 'required' });
        }

        if (errors.length) {
            return next(new ValidationError(errors));
        }

        stripe.accounts
            .create({
                type: 'custom',
                country: 'GB',
                email: req.body.email,
                external_account: req.body.token.id,
                tos_acceptance: {
                    date: Math.floor(Date.now() / 1000),
                    ip: req.ip
                }
            })
            .then((subscription) => {
                this.account.subscription.gateway = {
                    account: subscription.id,
                    bank: subscription.external_accounts.data.map((account) => {
                        return {
                            name: account.bank_name,
                            holder: account.account_holder_name,
                            number: account.last4,
                            sortCode: account.routing_number,
                            created: new Date()
                        };
                    }),
                    publicKey: subscription.keys.publishable,
                    privateKey: subscription.keys.secret
                };

                return this.account.subscription.save();
            })
            .then(() => next())
            .catch((err) => next(new ThirdPartyError(err.type, err.message)));
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
                        case 'strapline':
                            this.account.subscription[operation.path] = operation.value;
                    }
            }
        });

        this.account.subscription.save()
            .then(() => next())
            .catch((error) => next(error));
    }

}

export { SubscriptionController };
