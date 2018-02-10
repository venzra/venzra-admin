import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { ListModel } from 'models';
import { RestfulService } from 'services';

import { Product } from '../models/product';

@Injectable()
export class ProductService extends RestfulService {

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super();
    }

    statusList() {
        return [
            { name: 'Active', value: 'active' },
            { name: 'Inactive', value: 'inactive' }
        ];
    }

    createProduct(product: Product): Promise<boolean> {
        product.previousPrice *= 100;
        product.currentPrice *= 100;

        return this.http.post('/api/products', product)
            .toPromise()
            .then(() => this.router.navigate(['/products'], { replaceUrl: true }));
    }

    changeStatus(productId: string, status: string): Promise<Product> {
        return this.http.patch(`/api/products/${productId}`, [{ op: 'replace', path: 'status', value: status }])
            .toPromise()
            .then((response: any) => response as Product);
    }

    getProduct(productId: string): Promise<Product> {
        return this.http.get(`/api/products/${productId}`)
            .toPromise()
            .then((response: any) => response as Product);
    }

    getAllProducts(query): Promise<ListModel<Product>> {
        const params = Object.keys(query).reduce((httpParams, key) => httpParams.set(key, query[key]), new HttpParams());

        return this.http.get('/api/products', { params })
            .toPromise()
            .then((response: any) => response as ListModel<Product>);
    }

}

@Injectable()
export class ProductRetrieveResolve implements Resolve<Product> {
    constructor(
        private productService: ProductService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Product> {
        return this.productService.getProduct(route.params.productId);
    }
}

@Injectable()
export class ProductListResolve implements Resolve<ListModel<Product>> {
    constructor(
        private productService: ProductService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListModel<Product>> {
        return this.productService.getAllProducts(route.queryParams);
    }
}
