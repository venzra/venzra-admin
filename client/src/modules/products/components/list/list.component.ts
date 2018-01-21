import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';

import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { startWith } from 'rxjs/operators/startWith';
import { switchMap } from 'rxjs/operators/switchMap';

import 'rxjs/add/operator/debounceTime';

import { LayoutService } from '../../../../services/layout.service';
import { ListModel } from '../../../../services/restful.service';
import { Product, ProductService } from '../../../../services/product.service';

@Component({
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ProductListComponent implements OnInit {

    public products: ListModel<Product>;
    public searchForm: FormGroup;

    public availableColumns = ['image', 'code', 'displayName', 'currentPrice', 'status', 'created'];
    public dataSource = new MatTableDataSource();

    private statusChange: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private forms: FormBuilder,
        private productsService: ProductService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Products';

        this.searchForm = this.forms.group({
            searchQuery: ['', []]
        });

        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.searchForm.get('searchQuery').valueChanges.debounceTime(500).subscribe(() => this.paginator.pageIndex = 0);

        this.route.data.subscribe((data: { productData: ListModel<Product> }) => this.products = data.productData);

        merge(this.sort.sortChange, this.paginator.page, this.statusChange, this.searchForm.get('searchQuery').valueChanges.debounceTime(500))
            .pipe(
                startWith({}),
                switchMap(() => this.reload()),
                map((productData: ListModel<Product>) => {
                    this.products = productData;
                    return productData.list;
                }),
                catchError(() => observableOf([]))
            )
            .subscribe((data: Array<Product>) => this.dataSource.data = data);
    }

    get status() {
        return this.statusChange.getValue();
    }

    set status(choice) {
        if (this.statusChange.getValue() !== choice) {
            this.statusChange.next(choice);
        }
    }

    reload() {
        const search = this.searchForm.get('searchQuery').value;
        const status = this.statusChange.getValue();
        const sort = this.sort.active;
        const direction = this.sort.direction;
        const skip = this.paginator.pageIndex * this.paginator.pageSize;
        const limit = this.paginator.pageSize;

        const query = { search, status, sort, direction, skip, limit };
        Object.keys(query).forEach((key) => (!query[key]) && delete query[key]);
        return this.productsService.getAllProducts(query);
    }

    refresh() {
        this.reload()
            .then((orderData) => this.dataSource.data = orderData.list)
            .catch(() => this.dataSource.data = []);
    }

    navigateTo(product) {
        this.router.navigate(['/products', product._id]);
    }
}
