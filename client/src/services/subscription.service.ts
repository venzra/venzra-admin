import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { Gateway } from './gateway.service';
import { RestfulService } from './restful.service';

export class Pricing {
    currency: string;
    quantity: number;
    value: number;
}

export class Payment {
    package: string;
    customer: string;
    subscription: string;
    price: Pricing;
}

export class Subscription {
    _id: string;
    storeName: string;
    strapline: string;
    gateway: Gateway;
    payment: Payment;
    status: string;
    created: Date;
    updated: Date;
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

    updateSettings(formData: {[key: string]: AbstractControl}): Promise<Subscription> {
        const subscriptionData = this.preparePatch(formData);

        return this.http.patch(this.subscriptionUri, subscriptionData)
            .toPromise()
            .then((response) => response as Subscription)
            .then((subscription) => {
                subscription.payment.price.value /= 100;
                return subscription;
            });
    }

    getSubscription(): Promise<Subscription> {
        return this.http.get(this.subscriptionUri)
            .toPromise()
            .then((response) => response as Subscription)
            .then((subscription) => {
                subscription.payment.price.value /= 100;
                return subscription;
            });
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
