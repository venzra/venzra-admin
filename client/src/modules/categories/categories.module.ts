import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule, MatSnackBarModule, MatSortModule, MatTableModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { CategoryRoutingModule } from './routing.module';

import { ImageInputModule } from '@venzra/components/image-upload/image-input.module';
import { MarkdownModule } from '@venzra/components/markdown-editor/markdown.module';
import { MarkdownHelpModule } from '@venzra/components/markdown-help/markdown-help.module';
import { PageModule } from '@venzra/components/page/page.module';
import { FiltersModule } from '@venzra/filters/filters.module';

import { CategoryListResolve, CategoryRetrieveResolve, CategoryService } from './services/category.service';

import { CategoryCreateComponent } from './fragments/create/create.component';
import { CategoryListComponent } from './fragments/list/list.component';
import { CategoryManageComponent } from './fragments/manage/manage.component';
import { CategoryViewComponent } from './fragments/view/view.component';

@NgModule({
    declarations: [
        CategoryCreateComponent,
        CategoryListComponent,
        CategoryManageComponent,
        CategoryViewComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        MatTooltipModule,
        FlexLayoutModule,
        CategoryRoutingModule,
        ImageInputModule,
        MarkdownModule,
        MarkdownHelpModule,
        PageModule,
        FiltersModule
    ],
    providers: [
        CategoryService,
        CategoryListResolve,
        CategoryRetrieveResolve
    ]
})
export class CategoryModule {
}
