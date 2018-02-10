import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';

import { Order } from '../../../models/order';
import { OrderStatus } from '../../../models/order-status';

import { OrderService } from '../../../services/order.service';

@Component({
    templateUrl: './status.component.html',
    styleUrls: ['./status.component.scss']
})
export class OrderStatusDialogComponent implements OnInit {

    private dispatchForm: FormGroup;

    public statusList: Array<OrderStatus>;
    public currentState: OrderStatus;
    public selectedState: OrderStatus;

    constructor(
        private forms: FormBuilder,
        public dialogRef: MatDialogRef<OrderStatusDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: { order: Order },
        private snackbar: MatSnackBar,
        private orderService: OrderService
    ) { }

    ngOnInit(): void {
        this.statusList = [
            { name: 'Created', position: 0, value: 'CREATED', description: 'The order has been placed, but payment has not yet been validated.' },
            { name: 'Authorised', position: 1, value: 'AUTHORISED', description: 'The order has been placed and payment has been successfully approved by the payment gateway.' },
            { name: 'Processing', position: 2, value: 'PROCESSING', description: 'Order has been acknowledged and stock is being allocated ready for shipping.' },
            { name: 'Dispatched', position: 3, value: 'DISPATCHED', description: 'The order has been collected by the delivery company / individual and is on its way to the customer.' },
            { name: 'Delivered', position: 4, value: 'DELIVERED', description: 'Following confirmation that the order has been received the order should be marked as delivered.' }
        ];

        this.selectedState = this.currentState = this.statusList.find((state) => state.value === this.data.order.status);

        this.dispatchForm = this.forms.group({
            courier: ['', [Validators.maxLength(50)]],
            tracking: ['', [Validators.maxLength(30)]]
        });
    }

    updateStatus(event) {
        this.selectedState = event.value;
    }

    cancel() {
        this.dialogRef.close(this.data.order);
    }

    save() {
        if (this.selectedState.value !== this.currentState.value) {
            let changes = { status: this.selectedState.value };

            if (this.selectedState.value === 'DISPATCHED') {
                changes = Object.assign({}, changes, this.dispatchForm.getRawValue());
            }

            this.orderService
                .changeStatus(this.data.order._id, changes)
                .then((updatedOrder) => this.dialogRef.close(updatedOrder))
                .catch(() => this.snackbar.open('Failed to update, please try again', 'OK', { duration: 5000 }));
        } else {
            this.dialogRef.close(this.data.order);
        }
    }

}
