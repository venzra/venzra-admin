import { Request, Response, NextFunction, Router } from 'express';
import * as Stripe from 'stripe';

import { ThirdPartyError, ValidationError } from '../middleware/error-handler';

import { AuthenticationController } from './authentication';

import { IRestOperation } from '../models/rest';

import { environment } from '../config';
const stripe = new Stripe(environment.stripe);

class SubscriptionController extends AuthenticationController {

    constructor(private router: Router) {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/subscription', this.validate.bind(this), this.getSubscription.bind(this));
        this.router.post('/subscription', this.validate.bind(this), this.createSubscription.bind(this), this.getSubscription.bind(this));
        this.router.patch('/subscription', this.validate.bind(this), this.updateSettings.bind(this), this.getSubscription.bind(this));
    }

    createSubscription(req: Request, res: Response, next: NextFunction) {
        if (!this.account.subscription || this.account.subscription.stripe) {
            return next();
        }

        let errors = [];

        if (!req.body.email) {
            errors.push({ path: 'email', kind: 'required' });
        }

        if(!req.body.terms) {
            errors.push({ path: 'terms', kind: 'required' });
        }

        if (!req.body.token || !req.body.token.id) {
            errors.push({ path: 'token', kind: 'required' });
        }

        if(errors.length) {
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
                this.account.subscription.stripe = {
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
