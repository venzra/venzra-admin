import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { ListModel } from '@venzra/models';
import { RestfulService } from '@venzra/services';

import { Category } from '../models/category';

@Injectable()
export class CategoryService extends RestfulService {

    constructor(
        private http: HttpClient
    ) {
        super();
    }

    findAll(): Promise<ListModel<Category>> {
        return this.http.get<ListModel<Category>>('/api/categories/summary').toPromise();
    }

}

@Injectable()
export class CategoryListResolve implements Resolve<ListModel<Category>> {

    constructor(
        private categoryService: CategoryService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListModel<Category>> {
        return this.categoryService.findAll();
    }

}
