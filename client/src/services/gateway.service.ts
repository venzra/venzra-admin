import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Subscription } from './subscription.service';

import { environment } from '../../environments/environment';

import 'rxjs/add/operator/toPromise';

export class Gateway {
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
export class GatewayService {

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    createConnection(subscriptionData: object, bankData: BankAccount): Promise<Subscription> {
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
                return this.http.post('api/v1/gateway', { ...subscriptionData, ...token })
                    .toPromise()
                    .catch(() => {
                        throw new Error('Unable to create subscription, please contact us or try again later');
                    });
            })
            .then((subscription) => subscription as Subscription);
    }

}
