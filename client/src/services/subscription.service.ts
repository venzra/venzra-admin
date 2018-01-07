import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/operator/toPromise';

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
    term: Date;
}

export class Transaction {
    base: number;
    rate: number;
}

export class Subscription {
    _id: string;
    storeName: string;
    strapline: string;
    gateway: Gateway;
    payment: Payment;
    transactions: Transaction;
    plan?: any;
    status: string;
    created: Date;
    updated: Date;
}

@Injectable()
export class SubscriptionService extends RestfulService {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    updateSettings(formData: {[key: string]: AbstractControl}): Promise<Subscription> {
        const subscriptionData = this.preparePatch(formData);

        return this.http.patch('api/v1/subscription', subscriptionData)
            .toPromise()
            .then((response) => response as Subscription);
    }

    getSubscription(): Promise<Subscription> {
        return this.http.get('api/v1/subscription')
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
