import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';

import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';

import { ListModel } from '@venzra/models';
import { LayoutService } from '@venzra/services';

import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class CategoryListComponent implements OnInit, AfterViewInit {

    public availableColumns = ['image', 'name', 'children', 'products', 'primary'];
    public dataSource = new MatTableDataSource();
    public loading = false;
    public categories: ListModel<Category>;
    public searchForm: FormGroup;

    private _status: string = null;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private forms: FormBuilder,
        private categoryService: CategoryService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Categories';

        this.searchForm = this.forms.group({ searchQuery: ['', []] });

        this.categories = this.route.snapshot.data.categoriesData;
        this.dataSource.data = this.route.snapshot.data.categoriesData.list;
    }

    ngAfterViewInit(): void {
        const reset = merge(this.sort.sortChange, this.searchForm.get('searchQuery').valueChanges.debounceTime(500)).do(() => this.paginator.pageIndex = 0);

        merge(reset, this.paginator.page)
            .pipe(
                switchMap(() => this.reload()),
                map((categoriesData: ListModel<Category>) => {
                    this.loading = false;
                    this.categories = categoriesData;
                    return categoriesData.list;
                }),
                catchError(() => {
                    this.loading = false;
                    return observableOf([]);
                })
            )
            .subscribe((data: Array<Category>) => this.dataSource.data = data);
    }

    reload() {
        this.loading = true;

        const search = this.searchForm.get('searchQuery').value;
        const status = this._status;
        const sort = this.sort.active;
        const direction = this.sort.direction;
        const skip = this.paginator.pageIndex * this.paginator.pageSize;
        const limit = this.paginator.pageSize;

        const query = { search, status, sort, direction, skip, limit };
        Object.keys(query).forEach((key) => (!query[key]) && delete query[key]);

        return this.categoryService.findAll(query);
    }

    refresh() {
        this.reload()
            .then((categoriesData) => {
                this.loading = false;
                this.categories = categoriesData;
                this.dataSource.data = categoriesData.list;
            })
            .catch(() => {
                this.loading = false;
                this.dataSource.data = [];
            });
    }

    navigateTo(category) {
        this.router.navigate(['/categories', category._id]);
    }

}
