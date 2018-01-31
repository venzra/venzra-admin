import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Product, ProductService } from '../../../../services/product.service';
import { LayoutService } from '../../../../services/layout.service';

@Component({
    templateUrl: './create.component.html'
})
export class ProductCreateComponent implements OnInit {

    product: Product;
    productForm: FormGroup;

    constructor(
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private productService: ProductService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Products';

        this.productForm = this.forms.group({
            displayName: ['', [Validators.required]],
            code: ['', [Validators.required]],
            description: ['', [Validators.required]],
            promotionalImage: ['', [Validators.required]],
            featureImage: [null, []],
            previousPrice: ['', [Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0)]],
            currentPrice: ['', [Validators.required, Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0)]],
            status: [true, []]
        });
    }

    createProduct() {
        const productData = this.productForm.getRawValue();
        productData.status = productData.status ? 'ACTIVE' : 'INACTIVE';

        this.productService
            .createProduct(productData)
            .catch((response) => this.snackbar.open(response.error.message || 'Create failed', 'OK', { duration: 5000 }));
    }

}
