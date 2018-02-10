import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { Subscription } from '../models/subscription';

@Injectable()
export class GatewayService {

    constructor(
        private http: HttpClient
    ) { }

    createConnection(reference: string): Promise<Subscription> {
        return Promise.resolve()
            .then((token) =>
                this.http.post('/api/subscription/gateway', { reference })
                    .toPromise()
                    .catch((error) => {
                        throw new Error('Unable to attach gateway, please contact us or try again later');
                    })
            )
            .then((subscription) => subscription as Subscription);
    }

}
