import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { LayoutService } from '@venzra/services';

import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss']
})
export class CategoryViewComponent implements OnInit {

    public category: Category;
    public image: SafeStyle;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private sanitizer: DomSanitizer,
        private categoryService: CategoryService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Categories';
        this.category = this.route.snapshot.data.categoryData;

        if (this.category.featureImage) {
            this.image = this.sanitizer.bypassSecurityTrustStyle(`url(/api/images/${this.category.featureImage})`);
        }
    }

}
