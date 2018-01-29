import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ShippingService } from '../../services/shipping.service';
import { LayoutService } from '../../../../services/layout.service';

@Component({
    templateUrl: './create.component.html'
})
export class ShippingCreateComponent implements OnInit {

    shippingForm: FormGroup;

    constructor(
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private shippingService: ShippingService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Shipping';

        this.shippingForm = this.forms.group({
            displayName: ['', [Validators.required]],
            currentPrice: ['', [Validators.required, Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0)]],
            cartMinimum: [0, [Validators.required, Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0)]],
            cartMaximum: [0, [Validators.required, Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0)]],
            shipmentTime: [48, [Validators.required, Validators.pattern(/^(\d+)$/), Validators.min(0)]],
        });
    }

    createShipping() {
        const shippingData = this.shippingForm.getRawValue();

        this.shippingService
            .createShipping(shippingData)
            .catch((error: HttpErrorResponse) => this.snackbar.open(error.message || 'Create failed', 'OK', { duration: 5000 }));
    }

}
