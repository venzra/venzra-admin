import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import 'rxjs/add/operator/toPromise';

import { RestfulService } from 'services';

import { Subscription } from '../models/subscription';

@Injectable()
export class SubscriptionService extends RestfulService {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    updateSettings(formData: {[key: string]: AbstractControl}): Promise<Subscription> {
        const subscriptionData = this.preparePatch(formData);

        return this.http.patch('/api/subscription', subscriptionData)
            .toPromise()
            .then((response) => response as Subscription);
    }

    getSubscription(): Promise<Subscription> {
        return this.http.get('/api/subscription')
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
