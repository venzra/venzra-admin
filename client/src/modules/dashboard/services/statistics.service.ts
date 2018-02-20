import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { RestfulService } from '@venzra/services';
import { ListModel } from '@venzra/models';

import { Highlights } from '../models/highlights';
import { Statistics } from '../models/statistics';

@Injectable()
export class StatisticsService extends RestfulService {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    getHighlights(): Promise<Highlights> {
        return this.http.get('/api/statistics/highlights')
            .toPromise()
            .then((response) => response as Highlights);
    }

    getOrderVolumes(): Promise<ListModel<Statistics>> {
        return this.http.get('/api/statistics/orders/volume')
            .toPromise()
            .then((response) => response as ListModel<Statistics>);
    }

    getOrderStates(): Promise<ListModel<Statistics>> {
        return this.http.get('/api/statistics/orders/status')
            .toPromise()
            .then((response) => response as ListModel<Statistics>);
    }

}

@Injectable()
export class HighlightsResolve implements Resolve<Highlights> {

    constructor(
        private statisticsService: StatisticsService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Highlights> {
        return this.statisticsService.getHighlights();
    }

}

@Injectable()
export class OrderVolumeResolve implements Resolve<ListModel<Statistics>> {

    constructor(
        private statisticsService: StatisticsService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListModel<Statistics>> {
        return this.statisticsService.getOrderVolumes();
    }

}

@Injectable()
export class OrderStatesResolve implements Resolve<ListModel<Statistics>> {

    constructor(
        private statisticsService: StatisticsService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListModel<Statistics>> {
        return this.statisticsService.getOrderStates();
    }

}
