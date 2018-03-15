import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ProductCategoryComponent } from './fragments/categories/categories.component';
import { ProductCreateComponent } from './fragments/create/create.component';
import { ProductListComponent } from './fragments/list/list.component';
import { ProductManageComponent } from './fragments/manage/manage.component';
import { ProductViewComponent } from './fragments/view/view.component';

import { CategoryListResolve } from './services/category.service';
import { ProductListResolve, ProductRetrieveResolve } from './services/product.service';

const routes: Routes = [
    {
        path: '',
        component: ProductListComponent,
        resolve: {
            productData: ProductListResolve
        }
    },
    {
        path: 'create',
        component: ProductCreateComponent
    },
    {
        path: ':productId',
        component: ProductViewComponent,
        resolve: {
            productData: ProductRetrieveResolve
        }
    },
    {
        path: ':productId/manage',
        component: ProductManageComponent,
        resolve: {
            productData: ProductRetrieveResolve
        }
    },
    {
        path: ':productId/categories',
        component: ProductCategoryComponent,
        resolve: {
            categoryData: CategoryListResolve,
            productData: ProductRetrieveResolve
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule {
}
