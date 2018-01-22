import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { Subject } from 'rxjs/Subject';

import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';

import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';

import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/do';

import { LayoutService } from '../../../../services/layout.service';
import { ListModel } from '../../../../services/restful.service';
import { Product, ProductService } from '../../../../services/product.service';

@Component({
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ProductListComponent implements OnInit, AfterViewInit {

    public availableColumns = ['image', 'code', 'displayName', 'currentPrice', 'status', 'created'];
    public dataSource = new MatTableDataSource();
    public loading = false;
    public products: ListModel<Product>;
    public searchForm: FormGroup;
    public statusList: Array<any>;

    private _status: string = null;
    private statusChange: Subject<string> = new Subject<string>();

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
        this.statusList = this.productsService.statusList();

        this.searchForm = this.forms.group({ searchQuery: ['', []] });

        this.products = this.route.snapshot.data.productData;
        this.dataSource.data = this.route.snapshot.data.productData.list;
    }

    ngAfterViewInit(): void {
        const reset = merge(this.sort.sortChange, this.statusChange, this.searchForm.get('searchQuery').valueChanges.debounceTime(500)).do(() => this.paginator.pageIndex = 0);

        merge(reset, this.paginator.page)
            .pipe(
                switchMap(() => this.reload()),
                map((productData: ListModel<Product>) => {
                    this.loading = false;
                    this.products = productData;
                    return productData.list;
                }),
                catchError(() => {
                    this.loading = false;
                    return observableOf([]);
                })
            )
            .subscribe((data: Array<Product>) => this.dataSource.data = data);
    }

    get status() {
        return this._status;
    }

    set status(choice) {
        if (this._status !== choice) {
            this._status = choice;
            this.statusChange.next(choice);
        }
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

        return this.productsService.getAllProducts(query);
    }

    refresh() {
        this.reload()
            .then((productData) => {
                this.loading = false;
                this.products = productData;
                this.dataSource.data = productData.list;
            })
            .catch(() => {
                this.loading = false;
                this.dataSource.data = [];
            });
    }

    navigateTo(product) {
        this.router.navigate(['/products', product._id]);
    }
}
