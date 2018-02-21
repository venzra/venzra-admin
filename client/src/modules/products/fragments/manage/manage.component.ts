import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';

import { MarkdownHelpComponent } from '@venzra/components/markdown-help/markdown-help.component';
import { LayoutService } from '@venzra/services';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
    templateUrl: './manage.component.html'
})
export class ProductManageComponent implements OnInit {

    product: Product;
    productForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private forms: FormBuilder,
        private dialog: MatDialog,
        private productService: ProductService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Products';

        this.productForm = this.forms.group({
            displayName: ['', [Validators.required, Validators.maxLength(80)]],
            code: [{ value: '', disabled: true }, [Validators.required, Validators.maxLength(20)]],
            description: ['', [Validators.required, Validators.maxLength(2000)]],
            promotionalImage: ['', [Validators.required]],
            featureImage: [null, []],
            previousPrice: [null, [Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0), Validators.max(1000000)]],
            currentPrice: ['', [Validators.required, Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0), Validators.max(1000000)]],
            status: [true, []]
        });

        this.product = this.route.snapshot.data.productData;
        this.productForm.reset(this.product);
    }

    updateProduct() {
        this.productService.updateProduct(this.product._id, this.productForm.controls);
    }

    markdownHelp() {
        this.dialog.open(MarkdownHelpComponent, { width: '90%', maxWidth: '720px' });
    }

}
