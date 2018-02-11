import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import 'rxjs/add/operator/toPromise';

import { RestfulService } from 'services';

import { Statistics } from '../models/statistics';
import { ListModel } from 'models';

@Injectable()
export class StatisticsService extends RestfulService {

    constructor(
        private http: HttpClient
    ) {
        super();
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
