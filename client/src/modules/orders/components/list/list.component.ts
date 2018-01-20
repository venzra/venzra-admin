import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator, MatSort, MatTableDataSource, PageEvent } from '@angular/material';

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
import { Order, OrderService } from '../../../../services/order.service';

@Component({
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class OrderListComponent implements OnInit {

    public orders: ListModel<Order>;
    public searchForm: FormGroup;

    public loading = false;
    public availableColumns = ['reference', 'identity', 'destination', 'value', 'status', 'created'];
    public dataSource = new MatTableDataSource();

    private statusChange: BehaviorSubject<string> = new BehaviorSubject<string>(null);

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private forms: FormBuilder,
        private ordersService: OrderService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Orders';

        this.searchForm = this.forms.group({
            searchQuery: ['', []]
        });

        this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
        this.searchForm.get('searchQuery').valueChanges.debounceTime(500).subscribe(() => this.paginator.pageIndex = 0);

        this.route.data.subscribe((data: { orderData: ListModel<Order> }) => {
            this.dataSource.data = data.orderData.list;
            this.orders = data.orderData;
        });

        merge(this.sort.sortChange, this.paginator.page, this.statusChange, this.searchForm.get('searchQuery').valueChanges.debounceTime(500))
            .pipe(
                startWith({}),
                switchMap(() => {
                    this.loading = true;

                    const search = this.searchForm.get('searchQuery').value;
                    const status = this.statusChange.getValue();
                    const sort = this.sort.active;
                    const direction = this.sort.direction;
                    const skip = this.paginator.pageIndex * this.paginator.pageSize;
                    const limit = this.paginator.pageSize;

                    const query = { search, status, sort, direction, skip, limit };
                    Object.keys(query).forEach((key) => (!query[key]) && delete query[key]);
                    return this.ordersService.getAllOrders(query);
                }),
                map((orderData: ListModel<Order>) => {
                    this.loading = false;
                    this.orders = orderData;

                    return orderData.list;
                }),
                catchError(() => {
                    this.loading = false;
                    return observableOf([]);
                })
            )
            .subscribe((data: Array<Order>) => this.dataSource.data = data);
    }

    get status() {
        return this.statusChange.getValue();
    }

    set status(choice) {
        if (this.statusChange.getValue() !== choice) {
            this.statusChange.next(choice);
        }
    }

    updatePage(pageEvent: PageEvent) {
        const skip = pageEvent.pageIndex * pageEvent.pageSize;
        const limit = pageEvent.pageSize;

        this.router.navigate(['/orders'], {
            queryParams: { skip, limit },
            queryParamsHandling: 'merge',
            replaceUrl: true
        });
    }

    navigateTo(order) {
        this.router.navigate(['/orders', order._id]);
    }
}
