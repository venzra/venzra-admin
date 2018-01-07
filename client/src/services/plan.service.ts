import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { ListModel } from './restful.service';

import 'rxjs/add/operator/toPromise';

export class Plan {
    reference: string;
    name: string;
    currency: string;
    price: number;
    interval: number;
    frequency: string;
}

@Injectable()
export class PlanService {

    constructor(
        private http: HttpClient
    ) { }

    getAllPlans(): Promise<ListModel<Plan>> {
        return this.http.get('api/v1/plans')
            .toPromise()
            .then((response: any) => response as ListModel<Plan>);
    }

}

@Injectable()
export class PlanListResolve implements Resolve<ListModel<Plan>> {
    constructor(
        private planService: PlanService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListModel<Plan>> {
        return this.planService.getAllPlans();
    }
}
