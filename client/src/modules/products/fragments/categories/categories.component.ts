import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ListModel } from '@venzra/models';

import { Category } from '../../models/category';
import { Product } from '../../models/product';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    templateUrl: './categories.component.html'
})
export class ProductCategoryComponent implements OnInit {

    public product: Product;
    public categories: ListModel<Category>;
    public categoryForm: FormGroup;

    constructor(
        private forms: FormBuilder,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.categories = this.route.snapshot.data.categoryData;
        this.product = this.route.snapshot.data.productData;

        this.categoryForm = this.forms.group({
            categories: [null, []]
        });
    }

    assignCategories(): void {
        console.log(this.categoryForm.getRawValue());
    }

}
