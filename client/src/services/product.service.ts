import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';

import { RestfulService, ListModel } from './restful.service';

export class Product {
    _id?: string;
    name: string;
    code: string;
    price: number;
    status?: string;
    created?: Date;
    updated?: Date;
}

@Injectable()
export class ProductService extends RestfulService {

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        super();
    }

    createProduct(product: Product): Promise<boolean> {
        product.price *= 100;

        return this.http.post('api/v1/products', product)
            .toPromise()
            .then(() => this.router.navigate(['/products'], { replaceUrl: true }));
    }

    getProduct(productId: string): Promise<Product> {
        return this.http.get(`api/v1/products/${productId}`)
            .toPromise()
            .then((response: any) => response as Product)
            .then((product) => {
                product.price /= 100;
                return product;
            });
    }

    getAllProducts(): Promise<ListModel<Product>> {
        return this.http.get('api/v1/products')
            .toPromise()
            .then((response: any) => response as ListModel<Product>)
            .then((products) => {
                products.list.forEach((product) => {
                    product.price /= 100;
                    return product;
                });
                return products;
            });
    }

}

@Injectable()
export class ProductRetrieveResolve implements Resolve<Product> {
    constructor(
        private productService: ProductService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Product> {
        return this.productService.getProduct('');
    }
}

@Injectable()
export class ProductListResolve implements Resolve<ListModel<Product>> {
    constructor(
        private productService: ProductService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListModel<Product>> {
        return this.productService.getAllProducts();
    }
}
