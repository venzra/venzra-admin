import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { ListModel, RestfulService } from '../../../services/restful.service';

export interface Shipping {
    _id: string;
    displayName: string;
    cartMinimum: number;
    cartMaximum: number;
    currentPrice: number;
    shipmentTime: number;
}

@Injectable()
export class ShippingService extends RestfulService {

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super();
    }

    createShipping(shipping: Shipping): Promise<boolean> {
        shipping.cartMinimum *= 100;
        shipping.cartMaximum *= 100;
        shipping.currentPrice *= 100;

        return this.http.post('/api/shipping', shipping)
            .toPromise()
            .then(() => this.router.navigate(['/shipping'], { replaceUrl: true }));
    }

    removeShipping(shippingId): Promise<boolean> {
        return this.http.delete(`/api/shipping/${shippingId}`)
            .toPromise()
            .then(() => true);
    }

    getAllShipping(query): Promise<ListModel<Shipping>> {
        const params = Object.keys(query).reduce((httpParams, key) => httpParams.set(key, query[key]), new HttpParams());

        return this.http.get('/api/shipping', { params })
            .toPromise()
            .then((response: any) => response as ListModel<Shipping>);
    }

}

@Injectable()
export class ShippingListResolve implements Resolve<ListModel<Shipping>> {
    constructor(
        private shippingService: ShippingService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListModel<Shipping>> {
        return this.shippingService.getAllShipping(route.queryParams);
    }
}
