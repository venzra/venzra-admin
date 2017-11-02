import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSlideToggleChange, PageEvent } from '@angular/material';

import 'rxjs/add/operator/debounceTime';

import { LayoutService } from '../../../../services/layout.service';
import { ListModel } from '../../../../services/restful.service';
import { Product, ProductService } from '../../../../services/product.service';

@Component({
    selector: 'product-list',
    templateUrl: './list.component.html'
})
export class ProductListComponent implements OnInit {

    public products: ListModel<Product>;
    public searchForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private forms: FormBuilder,
        private productService: ProductService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Products';

        this.searchForm = this.forms.group({
            searchQuery: ['', []]
        });

        this.searchForm.get('searchQuery').valueChanges.debounceTime(500).subscribe(() => this.performSearch());

        this.route.data.subscribe((data: { productData: ListModel<Product> }) => {
            this.products = data.productData;
        });

        this.route.queryParams.subscribe((params) => {
            this.productService.getAllProducts(params)
                .then((products) => this.products = products);

            this.searchForm.get('searchQuery').setValue(params.search, { emitEvent: false });
        });
    }

    toggleActive(event: MatSlideToggleChange, product: Product) {
        this.productService.changeStatus(product._id, event.checked ? 'ACTIVE' : 'INACTIVE');
    }

    updatePage(pageEvent: PageEvent) {
        const skip = pageEvent.pageIndex * pageEvent.pageSize;
        const limit = pageEvent.pageSize;

        this.router.navigate(['/products'], { queryParams: { skip, limit }, queryParamsHandling: 'merge', replaceUrl: true });
    }

    performSearch() {
        const search = this.searchForm.get('searchQuery').value;
        const skip = 0;

        this.router.navigate(['/products'], { queryParams: { skip, search }, queryParamsHandling: 'merge', replaceUrl: true });
    }
}
