import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';

import { merge } from 'rxjs/observable/merge';
import { of as observableOf } from 'rxjs/observable/of';

import { catchError } from 'rxjs/operators/catchError';
import { map } from 'rxjs/operators/map';
import { switchMap } from 'rxjs/operators/switchMap';

import 'rxjs/add/operator/do';

import { Shipping, ShippingService } from '../../services/shipping.service';
import { LayoutService } from '../../../../services/layout.service';
import { ListModel } from '../../../../services/restful.service';
import { RemoveShippingDialogComponent } from './remove/remove.dialog';

@Component({
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.scss']
})
export class ShippingListComponent implements OnInit, AfterViewInit {

    public availableColumns = ['displayName', 'currentPrice', 'cartMinimum', 'cartMaximum', 'shipmentTime', 'created', 'remove'];
    public dataSource = new MatTableDataSource();
    public loading = false;
    public shipping: ListModel<Shipping>;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private shippingService: ShippingService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Shipping';

        this.shipping = this.route.snapshot.data.shippingData;
        this.dataSource.data = this.route.snapshot.data.shippingData.list;
    }

    ngAfterViewInit(): void {
        const reset = merge(this.sort.sortChange).do(() => this.paginator.pageIndex = 0);

        merge(reset, this.paginator.page)
            .pipe(
                switchMap(() => this.reload()),
                map((shippingData: ListModel<Shipping>) => {
                    this.loading = false;
                    this.shipping = shippingData;
                    return shippingData.list;
                }),
                catchError(() => {
                    this.loading = false;
                    return observableOf([]);
                })
            )
            .subscribe((data: Array<Shipping>) => this.dataSource.data = data);
    }

    reload() {
        this.loading = true;

        const sort = this.sort.active;
        const direction = this.sort.direction;
        const skip = this.paginator.pageIndex * this.paginator.pageSize;
        const limit = this.paginator.pageSize;

        const query = { sort, direction, skip, limit };
        Object.keys(query).forEach((key) => (!query[key]) && delete query[key]);

        return this.shippingService.getAllShipping(query);
    }

    refresh() {
        this.reload()
            .then((shippingData) => {
                this.loading = false;
                this.shipping = shippingData;
                this.dataSource.data = shippingData.list;
            })
            .catch(() => {
                this.loading = false;
                this.dataSource.data = [];
            });
    }

    remove(shipping) {
        const dialogRef = this.dialog.open(RemoveShippingDialogComponent, { width: '640px', disableClose: true, data: { shipping } });
        dialogRef.afterClosed().subscribe((reload = false) => reload ? this.refresh() : null);
    }
}
