import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { ListModel } from '@venzra/models';
import { LayoutService } from '@venzra/services';
import { MarkdownHelpComponent } from '@venzra/components/markdown-help/markdown-help.component';

import { Category } from './../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
    templateUrl: './manage.component.html'
})
export class CategoryManageComponent implements OnInit {

    public category: Category;
    public categoryForm: FormGroup;
    public categories: ListModel<Category>;

    constructor(
        private route: ActivatedRoute,
        private forms: FormBuilder,
        private dialog: MatDialog,
        private categoryService: CategoryService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Categories';
        this.categories = this.route.snapshot.data.categoriesData;

        this.categoryForm = this.forms.group({
            parent: [this.route.snapshot.queryParams.parent, []],
            name: [null, [Validators.required, Validators.maxLength(30)]],
            description: [null, [Validators.required, Validators.maxLength(1000)]],
            primary: [false, []],
            featureImage: [null, []]
        });

        this.category = this.route.snapshot.data.categoryData;

        if (this.category.parent) {
            this.category.parent = (<Category>this.category.parent)._id;
            this.categoryForm.get('primary').disable();
        }

        if (this.category.children.length) {
            this.categoryForm.get('parent').disable();
        }

        this.categoryForm.reset(this.category);
    }

    updateCategory() {
        this.categoryService.updateCategory(this.category._id, this.categoryForm.controls);
    }

    markdownHelp() {
        this.dialog.open(MarkdownHelpComponent, { width: '90%', maxWidth: '720px' });
    }

}
