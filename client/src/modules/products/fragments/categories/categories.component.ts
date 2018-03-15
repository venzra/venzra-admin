import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ListModel } from '@venzra/models';
import { LayoutService } from '@venzra/services';

import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
    templateUrl: './categories.component.html'
})
export class ProductCategoryComponent implements OnInit, AfterViewInit {

    public product: Product;
    public categories: ListModel<Category>;
    public categoryForm: FormGroup;

    constructor(
        private forms: FormBuilder,
        private route: ActivatedRoute,
        private productService: ProductService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Product Categories';

        this.categories = this.route.snapshot.data.categoryData;
        this.product = this.route.snapshot.data.productData;

        this.categoryForm = this.forms.group({
            categories: [[], []]
        });

    }

    ngAfterViewInit(): void {
        setTimeout(_ => this.resetForm());
    }

    resetForm() {
        this.categoryForm.get('categories').setValue(this.product.categories.map((category) => category._id));
    }

    assignCategories(): void {
        this.productService.updateProduct(this.product._id, this.categoryForm.controls);
    }

}
