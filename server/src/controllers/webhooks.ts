import { Request, Response, NextFunction, Router } from 'express';
import * as Stripe from 'stripe';

import { ThirdPartyError } from '../middleware/error-handler';

import { environment } from '../config';
import { PlanModel } from '../models/plans';

const stripe = new Stripe(environment.stripe);

interface StripeWebhook {
    type: string;
    data: any
}

class WebhookController {

    constructor(private router: Router) {
        this.registerRoutes();
    }

    registerRoutes() {
        this.router.post('/stripe', this.actionHook.bind(this));
    }

    actionHook(req: Request, res: Response, next: NextFunction) {
        const signature = req.headers['stripe-signature'];

        const promise = new Promise((resolve, reject) => {
            try {
                const event = stripe.webhooks.constructEvent(req.body, signature, environment.stripeWebhooks);

                const type = event.type;
                const data = event.data.object;

                resolve({ type, data });
            } catch (error) {
                reject(error);
            }
        });

        promise
            .then((payload: StripeWebhook) => {
                const type = payload.type.split('.');

                switch (type[0]) {
                    case 'plan':
                        let update = Promise.resolve(PlanModel.findOne({ reference: payload.data.id }));

                        switch (type[1]) {
                            case 'created':
                                const planData = {
                                    reference: payload.data.id,
                                    name: payload.data.name,
                                    currency: payload.data.currency,
                                    price: payload.data.amount,
                                    interval: payload.data.interval_count,
                                    frequency: payload.data.interval
                                };
                                update = update.then((plan) => !plan ? PlanModel.create(planData) : null);
                                break;
                            case 'deleted':
                                update = update.then((plan) => plan ? plan.remove() : null);
                                break;
                        }

                        return update;
                    default:
                        console.log(`Ignored web hook for "${payload.type}"`);
                }

            })
            .then((record: any) => res.status(200).send({ result: record ? record._id : 'skipped' }))
            .catch((error) => next(new ThirdPartyError(error.type, error.message)));
    }

}

export { WebhookController };
