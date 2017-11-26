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
            .resolve((<any>window).Stripe)
            .then((stripe) => {
                stripe.setPublishableKey(environment.stripe);
                return stripe;
            })
            .then((stripe) => new Promise((resolve, reject) => stripe.bankAccount.createToken({
                    country: 'GB',
                    currency: 'gbp',
                    account_holder_name: bankData.holder,
                    account_number: bankData.number,
                    routing_number: bankData.sortCode
                }, ((status, response) => {
                    switch (status) {
                        case 200:
                            resolve(response);
                            break;
                        default:
                            reject(new Error(response.error.message));
                    }
                })
            )))
            .then((token) =>
                this.http.post('api/v1/gateway', { token, ...subscriptionData })
                    .toPromise()
                    .catch((error) => {
                        console.log(error);
                        throw new Error('Unable to attach gateway, please contact us or try again later');
                    })
            )
            .then((subscription) => subscription as Subscription)
            .then((subscription) => {
                if(subscription.payment) {
                    subscription.payment.price.value /= 100;
                }
                return subscription;
            });
    }

}
