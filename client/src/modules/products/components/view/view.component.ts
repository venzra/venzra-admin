import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material';

import { Product, ProductService } from '../../../../services/product.service';
import { LayoutService } from '../../../../services/layout.service';

@Component({
    selector: 'product-view',
    templateUrl: './view.component.html'
})
export class ProductViewComponent implements OnInit {

    product: Product;

    constructor(
        private route: ActivatedRoute,
        private productService: ProductService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Products';

        this.route.data.subscribe((data: { productData: Product }) => {
            this.product = data.productData;
        });
    }

    toggleActive(event: MatSlideToggleChange) {
        this.productService
            .changeStatus(this.product._id, event.checked ? 'ACTIVE' : 'INACTIVE')
            .then((product) => this.product = product);
    }

}
