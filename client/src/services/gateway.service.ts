import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Subscription } from './subscription.service';

import { environment } from '../../environments/environment';

import 'rxjs/add/operator/toPromise';

interface LegalEntity {
    forename: string;
    surname: string;
    email: string;
    dob: Date;
}

interface Address {
    company?: string;
    building: string;
    street: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
}

export class Gateway {
    account: string;
    entity: LegalEntity;
    address: Address;
    bank: BankAccount[];
    status: string;
    modified: Date;
}

export class BankAccount {
    holder: string;
    name?: string;
    number: number;
    sortCode: string;
}

@Injectable()
export class GatewayService {

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    createConnection(reference: string): Promise<Subscription> {
        console.log(reference);
        return Promise.resolve()
        // return Promise
        //     .resolve((<any>window).Stripe)
        //     .then((stripe) => {
        //         stripe.setPublishableKey(environment.stripe);
        //         return stripe;
        //     })
        //     .then((stripe) => new Promise((resolve, reject) => stripe.bankAccount.createToken({
        //             country: 'GB',
        //             currency: 'gbp',
        //             account_holder_name: bankData.holder,
        //             account_number: bankData.number,
        //             routing_number: bankData.sortCode
        //         }, ((status, response) => {
        //             switch (status) {
        //                 case 200:
        //                     resolve(response);
        //                     break;
        //                 default:
        //                     reject(new Error(response.error.message));
        //             }
        //         })
        //     )))
            .then((token) =>
                this.http.post('/api/subscription/gateway', { reference })
                    .toPromise()
                    .catch((error) => {
                        console.log(error);
                        throw new Error('Unable to attach gateway, please contact us or try again later');
                    })
            )
            .then((subscription) => subscription as Subscription);
    }

}
