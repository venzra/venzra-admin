import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { environment } from '@venzra/environment';

import { Card } from '../models/card';
import { Subscription } from '../models/subscription';

@Injectable()
export class PaymentService {

    constructor(
        private http: HttpClient
    ) { }

    createSubscription(email: string, plan: string, cardData: Card): Promise<Subscription> {
        return Promise
            .resolve((<any>window).Stripe)
            .then((stripe) => {
                stripe.setPublishableKey(environment.stripe);
                return stripe;
            })
            .then((stripe) => new Promise((resolve, reject) => stripe.card.createToken({
                    name: cardData.cardHolder,
                    number: cardData.cardNumber,
                    exp_month: cardData.expiryMonth,
                    exp_year: cardData.expiryYear,
                    cvc: cardData.cardVerificationCheck,
                    address_line1: cardData.building,
                    address_line2: cardData.street,
                    address_city: cardData.city,
                    address_state: cardData.county,
                    address_zip: cardData.postalCode.replace(/\s+/g, '').toUpperCase()
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
                this.http.post('/api/subscription/payment', { email, plan, token })
                    .toPromise()
                    .catch(() => {
                        throw new Error('Unable to create subscription, please contact us or try again later');
                    })
            )
            .then((subscription) => subscription as Subscription);
    }

}
