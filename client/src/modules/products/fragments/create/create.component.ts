import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { LayoutService } from 'services';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

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
            displayName: ['', [Validators.required, Validators.maxLength(80)]],
            code: ['', [Validators.required, Validators.maxLength(20)]],
            description: ['', [Validators.required, Validators.maxLength(2000)]],
            promotionalImage: ['', [Validators.required]],
            featureImage: [null, []],
            previousPrice: ['', [Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0), Validators.max(1000000)]],
            currentPrice: ['', [Validators.required, Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0), Validators.max(1000000)]],
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
