import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoryListResolve, CategoryRetrieveResolve } from './services/category.service';

import { CategoryListComponent } from './fragments/list/list.component';
import { CategoryCreateComponent } from './fragments/create/create.component';
import { CategoryManageComponent } from './fragments/manage/manage.component';
import { CategoryViewComponent } from './fragments/view/view.component';

const routes: Routes = [
    {
        path: '',
        component: CategoryListComponent,
        resolve: {
            categoriesData: CategoryListResolve
        }
    },
    {
        path: 'create',
        component: CategoryCreateComponent,
        data: { parent: true },
        resolve: {
            categoriesData: CategoryListResolve
        }
    },
    {
        path: ':categoryId',
        component: CategoryViewComponent,
        resolve: {
            categoryData: CategoryRetrieveResolve
        }
    },
    {
        path: ':categoryId/manage',
        component: CategoryManageComponent,
        data: { parent: true },
        resolve: {
            categoriesData: CategoryListResolve,
            categoryData: CategoryRetrieveResolve
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
export class CategoryRoutingModule {
}
