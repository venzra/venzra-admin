import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { LayoutService } from 'services/index';

import { ShippingService } from '../../services/shipping.service';

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
            displayName: ['', [Validators.required, Validators.maxLength(80)]],
            currentPrice: ['', [Validators.required, Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0), Validators.max(1000000)]],
            cartMinimum: [0, [Validators.required, Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0), Validators.max(1000000)]],
            cartMaximum: [0, [Validators.required, Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0), Validators.max(1000000)]],
            shipmentTime: [48, [Validators.required, Validators.pattern(/^(\d+)$/), Validators.min(0), Validators.max(3000)]],
        });
    }

    createShipping() {
        const shippingData = this.shippingForm.getRawValue();

        this.shippingService
            .createShipping(shippingData)
            .catch((response) => this.snackbar.open(response.error.message || 'Create failed', 'OK', { duration: 5000 }));
    }

}
