import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

import { LayoutService } from '../../../../services/layout.service';
import { ListModel } from '../../../../services/restful.service';
import { Product } from '../../../../services/product.service';

@Component({
    selector: 'product-list',
    templateUrl: './list.component.html'
})
export class ProductListComponent implements OnInit {

    public products: ListModel<Product>;
    public searchForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private forms: FormBuilder,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Products';

        this.searchForm = this.forms.group({
            searchQuery: ['', []]
        });

        this.route.data.subscribe((data: { productData: ListModel<Product> }) => {
            this.products = data.productData;
        });
    }

    performSearch() {
        console.log('coming soon....');
    }
}
