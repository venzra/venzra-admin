import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSnackBar } from '@angular/material';

import { LayoutService } from '@venzra/services';
import { MarkdownHelpComponent } from '@venzra/components/markdown-help/markdown-help.component';

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
        private snackbar: MatSnackBar,
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
            previousPrice: ['', [Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0), Validators.max(1000000)]],
            currentPrice: ['', [Validators.required, Validators.pattern(/^(\d+)(\.\d{1,2})?$/), Validators.min(0), Validators.max(1000000)]],
            status: [true, []]
        });

        this.product = this.route.snapshot.data.productData;
        this.productForm.reset(this.product);
    }

    updateProduct() {
        this.productService
            .updateProduct(this.product._id, this.productForm.controls)
            .then(() => this.router.navigate(['/products', this.product._id]))
            .catch((response) => this.snackbar.open(response.error.message || 'Update failed', 'OK', { duration: 5000 }));
    }

    markdownHelp() {
        this.dialog.open(MarkdownHelpComponent, { width: '90%', maxWidth: '720px' });
    }

}
