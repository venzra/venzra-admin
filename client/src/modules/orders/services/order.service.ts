import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { ListModel } from '@venzra/models';
import { RestfulService } from '@venzra/services';

import { Order } from '../models/order';

@Injectable()
export class OrderService extends RestfulService {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    statusList() {
        return [
            { name: 'Created', value: 'created' },
            { name: 'Authorised', value: 'authorised' },
            { name: 'Processing', value: 'processing' },
            { name: 'Dispatched', value: 'dispatched' },
            { name: 'Delivered', value: 'delivered' },
            { name: 'Refunded', value: 'refunded' }
        ];
    }

    changeStatus(orderId: string, changes: any): Promise<Order> {
        const payload = Object.keys(changes).map((change) => ({ op: 'replace', path: change, value: changes[change] }));

        return this.http.patch(`/api/orders/${orderId}`, payload)
            .toPromise()
            .then((response: any) => response as Order);
    }

    getOrder(orderId: string): Promise<Order> {
        return this.http.get(`/api/orders/${orderId}`)
            .toPromise()
            .then((response: any) => response as Order);
    }

    getAllOrders(query): Promise<ListModel<Order>> {
        const params = Object.keys(query).reduce((httpParams, key) => httpParams.set(key, query[key]), new HttpParams());

        return this.http.get('/api/orders', { params })
            .toPromise()
            .then((response: any) => response as ListModel<Order>);
    }

}

@Injectable()
export class OrderRetrieveResolve implements Resolve<Order> {
    constructor(
        private orderService: OrderService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Order> {
        return this.orderService.getOrder(route.params.orderId);
    }
}

@Injectable()
export class OrderListResolve implements Resolve<ListModel<Order>> {
    constructor(
        private orderService: OrderService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListModel<Order>> {
        return this.orderService.getAllOrders(route.queryParams);
    }
}
