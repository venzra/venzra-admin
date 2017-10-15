import { Request, Response, NextFunction, Router } from 'express';

import { ISubscriptionModel, SubscriptionModel } from '../models/subscription';
import { IAccountModel } from '../models/account';

import { Authentication } from '../services/authentication';

class SubscriptionController extends Authentication {

    private subscription: ISubscriptionModel;

    constructor(private router: Router) {
        super();
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.get('/subscription', this.validate.bind(this), this.retrieve.bind(this));
        this.router.post('/subscription', this.validate.bind(this), this.subscribe.bind(this), this.retrieve.bind(this));
    }

    subscribe(req: Request, res: Response, next: NextFunction) {
        const storeName = req.body.storeName || '';
        const strapline = req.body.strapline;
        const account = this.getAccount();

        let promise = null;

        if (account.subscription) {
            promise = account.populate('subscription').execPopulate()
                .then((populated: IAccountModel) => {
                    const subscription = populated.subscription;
                    subscription.storeName = storeName;
                    subscription.strapline = strapline;
                    return subscription;
                });
        } else {
            promise = Promise
                .resolve(new SubscriptionModel({ storeName, strapline }));
        }

        promise.then((subscription) => subscription.save())
            .then((subscription: ISubscriptionModel) => {
                this.subscription = subscription;
                if (!account.subscription) {
                    account.subscription = subscription;
                    return account.save();
                }
            })
            .then(() => next())
            .catch((error) => next(error));
    }

    retrieve(req: Request, res: Response, next: NextFunction) {
        const account = this.getAccount();

        if (!account.subscription) {
            return res.status(200).send({});
        }

        account.populate({ path: 'subscription', select: 'domainName status strapline storeName' }).execPopulate()
            .then((populated: IAccountModel) => populated.subscription)
            .then((subscription) => res.status(200).send(subscription));
    }

}

export { SubscriptionController };
