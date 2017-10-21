import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { RestfulService } from './restful.service';

import { environment } from '../../environments/environment';

export class Subscription {
    _id: string;
    storeName: string;
    strapline: string;
    stripe: Stripe;
    status: string;
    created: Date;
    updated: Date;
}

export class Stripe {
    account: string;
    bank: [BankAccount];
    status: string;
}

export class BankAccount {
    name?: string;
    holder: string;
    number: number;
    sortCode: string;
    created?: Date;
}

@Injectable()
export class SubscriptionService extends RestfulService {
    private subscriptionUri = 'api/v1/subscription';

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super();
    }

    createSubscription(subscriptionData: object, bankData: BankAccount): Promise<boolean> {
        return Promise
            .resolve((<any>window).Stripe(environment.stripe))
            .then((stripe) => stripe.createToken('bank_account', {
                country: 'GB',
                currency: 'gbp',
                account_holder_name: bankData.holder,
                account_number: bankData.number,
                routing_number: bankData.sortCode
            }))
            .then((token) => {
                if (token.error) {
                    throw new Error(token.error.message);
                }
                return this.http.post(this.subscriptionUri, { ...subscriptionData, ...token })
                    .toPromise()
                    .catch(() => {
                        throw new Error('Unable to create subscription, please contact us or try again later');
                    });
            })
            .then(() => this.router.navigate(['/account'], { replaceUrl: true }));
    }

    updateSettings(formData: {[key: string]: AbstractControl}): Promise<Subscription> {
        const subscriptionData = this.preparePatch(formData);

        return this.http.patch(this.subscriptionUri, subscriptionData)
            .toPromise()
            .then((response) => response as Subscription);
    }

    getSubscription(): Promise<Subscription> {
        return this.http.get(this.subscriptionUri)
            .toPromise()
            .then((response) => response as Subscription);
    }
}

@Injectable()
export class SubscriptionRetrieveResolve implements Resolve<Subscription> {
    constructor(
        private subscriptionService: SubscriptionService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Subscription> {
        return this.subscriptionService.getSubscription();
    }
}
