import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { MarkdownHelpComponent } from '@venzra/components/markdown-help/markdown-help.component';
import { LayoutService } from '@venzra/services';

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
        private dialog: MatDialog,
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
            previousPrice: [null, [Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0), Validators.max(1000000)]],
            currentPrice: ['', [Validators.required, Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0), Validators.max(1000000)]],
            status: [true, []]
        });
    }

    createProduct() {
        const productData = this.productForm.getRawValue();
        productData.status = productData.status ? 'ACTIVE' : 'INACTIVE';

        this.productService.createProduct(productData);
    }

    markdownHelp() {
        this.dialog.open(MarkdownHelpComponent, { width: '90%', maxWidth: '720px' });
    }

}
