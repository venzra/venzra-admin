import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AccountRoutingModule } from './routing.module';

import { ImageInputModule } from 'components/image-upload/image-input.module';
import { MarkdownModule } from 'components/markdown-editor/markdown.module';
import { PageModule } from 'components/page/page.module';
import { FiltersModule } from 'filters/filters.module';

import { ProductCreateComponent } from './fragments/create/create.component';
import { ProductListComponent } from './fragments/list/list.component';
import { ProductViewComponent } from './fragments/view/view.component';

import { ProductListResolve, ProductRetrieveResolve, ProductService } from './services/product.service';

@NgModule({
    declarations: [
        ProductCreateComponent,
        ProductListComponent,
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
        PageModule,
        FiltersModule
    ],
    providers: [
        ProductService,
        ProductListResolve,
        ProductRetrieveResolve
    ]
})
export class ProductsModule {
}
