import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { Subscription } from './subscription.service';

import { environment } from '../../environments/environment';

import 'rxjs/add/operator/toPromise';

export class Payment {
    cardHolder: string;
    cardNumber: number;
    expiryMonth: number;
    expiryYear: number;
    cardVerificationCheck: number;
    building: string;
    street: string;
    city: string;
    county: string;
    postalCode: string;
}

@Injectable()
export class PaymentService {

    constructor(
        private http: HttpClient,
        private router: Router
    ) { }

    createSubscription(email: string, plan: string, paymentData: Payment): Promise<Subscription> {
        return Promise
            .resolve((<any>window).Stripe)
            .then((stripe) => {
                stripe.setPublishableKey(environment.stripe);
                return stripe;
            })
            .then((stripe) => new Promise((resolve, reject) => stripe.card.createToken({
                    name: paymentData.cardHolder,
                    number: paymentData.cardNumber,
                    exp_month: paymentData.expiryMonth,
                    exp_year: paymentData.expiryYear,
                    cvc: paymentData.cardVerificationCheck,
                    address_line1: paymentData.building,
                    address_line2: paymentData.street,
                    address_city: paymentData.city,
                    address_state: paymentData.county,
                    address_zip: paymentData.postalCode.replace(/\s+/g, '').toUpperCase()
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
                this.http.post('api/v1/payment', { email, plan, token })
                    .toPromise()
                    .catch(() => {
                        throw new Error('Unable to create subscription, please contact us or try again later');
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
