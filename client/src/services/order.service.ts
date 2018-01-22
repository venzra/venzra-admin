import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { RestfulService, ListModel, HistoryModel } from './restful.service';
import { Product } from './product.service';

interface Customer {
    identity: string;
    status: string;
}

interface Item {
    product: Product;
    quantity: number;
    price: number;
}

interface Shipping {
    courier: string;
    tracking: string;
    price: number;
}

interface Address {
    addressee: string;
    building: string;
    street: string;
    city: string;
    county: string;
    postalCode: string;
    country: string;
}

interface Fee {
    venzra: { amount: number, currency: string };
    gateway: { amount: number, currency: string };
    total: number;
}

interface Payment {
    name: string;
    card: number;
    brand: string;
    fee: Fee;
    value: number;
}

export interface Order {
    _id: string;
    customer: Customer;
    reference: string;
    items: Item[];
    shipping: Shipping;
    destination: Address;
    billing: Address;
    payment: Payment;
    history: HistoryModel[];
    status?: string;
    created?: Date;
    updated?: Date;
}

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
