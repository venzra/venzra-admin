import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AccountRoutingModule } from './routing.module';

import { ImageInputModule } from '@venzra/components/image-upload/image-input.module';
import { MarkdownModule } from '@venzra/components/markdown-editor/markdown.module';
import { MarkdownHelpModule } from '@venzra/components/markdown-help/markdown-help.module';
import { PageModule } from '@venzra/components/page/page.module';
import { FiltersModule } from '@venzra/filters/filters.module';

import { ProductCategoryComponent } from './fragments/categories/categories.component';
import { ProductCreateComponent } from './fragments/create/create.component';
import { ProductListComponent } from './fragments/list/list.component';
import { ProductManageComponent } from './fragments/manage/manage.component';
import { ProductViewComponent } from './fragments/view/view.component';

import { CategoryListResolve, CategoryService } from './services/category.service';
import { ProductListResolve, ProductRetrieveResolve, ProductService } from './services/product.service';

@NgModule({
    declarations: [
        ProductCategoryComponent,
        ProductCreateComponent,
        ProductListComponent,
        ProductManageComponent,
        ProductViewComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        FlexLayoutModule,
        AccountRoutingModule,
        ImageInputModule,
        MarkdownModule,
        MarkdownHelpModule,
        PageModule,
        FiltersModule
    ],
    providers: [
        CategoryService,
        CategoryListResolve,
        ProductService,
        ProductListResolve,
        ProductRetrieveResolve
    ]
})
export class ProductsModule {
}
