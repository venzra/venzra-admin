import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { ListModel } from '@venzra/models';

import { Plan } from '../models/plan';

@Injectable()
export class PlanListResolve implements Resolve<ListModel<Plan>> {
    constructor(
        private http: HttpClient
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListModel<Plan>> {
        return this.http.get('/api/subscription/plans')
            .toPromise()
            .then((response: any) => response as ListModel<Plan>);
    }
}
