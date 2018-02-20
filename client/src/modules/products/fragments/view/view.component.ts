import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatSlideToggleChange } from '@angular/material';

import { LayoutService } from '@venzra/services';

import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';

@Component({
    templateUrl: './view.component.html'
})
export class ProductViewComponent implements OnInit {

    public product: Product;

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
