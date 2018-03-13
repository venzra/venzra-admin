import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AbstractControl } from '@angular/forms';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { ListModel } from '@venzra/models';
import { RestfulService } from '@venzra/services';

import { Category } from '../models/category';

@Injectable()
export class CategoryService extends RestfulService {

    constructor(
        private http: HttpClient,
        private router: Router,
        private snackbar: MatSnackBar
    ) {
        super();
    }

    createCategory(category: Category): void {
        this.http.post('/api/categories', category)
            .toPromise()
            .then((result: Category) => this.router.navigate(['/categories/', result._id], { replaceUrl: true }))
            .catch((response) => this.snackbar.open(response.error.message || 'Create failed', 'OK', { duration: 5000 }));
    }

    updateCategory(categoryId: string, formData: { [key: string]: AbstractControl }): void {
        this.http.patch(`/api/categories/${categoryId}`, this.preparePatch(formData))
            .toPromise()
            .then(() => this.router.navigate(['/categories', categoryId]))
            .catch((response) => this.snackbar.open(response.error.message || 'Update failed', 'OK', { duration: 5000 }));
    }

    removeCategory(categoryId): Promise<boolean> {
        return this.http.delete<boolean>(`/api/categories/${categoryId}`).toPromise();
    }

    findOne(categoryId): Promise<Category> {
        return this.http.get<Category>(`/api/categories/${categoryId}`).toPromise();
    }

    findAll(query = {}): Promise<ListModel<Category>> {
        const params = Object.keys(query).reduce((httpParams, key) => httpParams.set(key, query[key]), new HttpParams());
        return this.http.get<ListModel<Category>>('/api/categories', { params }).toPromise();
    }

}

@Injectable()
export class CategoryRetrieveResolve implements Resolve<Category> {

    constructor(
        private categoryService: CategoryService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Category> {
        return this.categoryService.findOne(route.params.categoryId);
    }

}

@Injectable()
export class CategoryListResolve implements Resolve<ListModel<Category>> {

    constructor(
        private categoryService: CategoryService
    ) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<ListModel<Category>> {
        let params = {};

        if (route.data.parent) {
            params = { parent: true };
        }

        return this.categoryService.findAll(params);
    }

}
