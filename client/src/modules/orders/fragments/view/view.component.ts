import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatTableDataSource } from '@angular/material';

import { LayoutService } from '@venzra/services';

import { Order } from '../../models/order';

import { OrderService } from '../../services/order.service';

import { OrderStatusDialogComponent } from './status/status.component';

@Component({
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss']
})
export class OrderViewComponent implements OnInit {

    public order: Order;

    public availableColumns = ['code', 'displayName', 'quantity', 'price', 'value'];
    public dataSource = new MatTableDataSource();

    constructor(
        private route: ActivatedRoute,
        private dialog: MatDialog,
        private orderService: OrderService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Orders';

        this.route.data.subscribe((data: { orderData: Order }) => {
            this.dataSource.data = data.orderData.items;
            this.order = data.orderData;
        });
    }

    changeStatus() {
        const dialogRef = this.dialog.open(OrderStatusDialogComponent, { width: '90%', maxWidth: '640px', disableClose: true, data: { order: this.order } });
        dialogRef.afterClosed().subscribe((order) => this.order = order);
    }

}
