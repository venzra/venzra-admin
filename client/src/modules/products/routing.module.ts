import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ProductCreateComponent } from './fragments/create/create.component';
import { ProductListComponent } from './fragments/list/list.component';
import { ProductViewComponent } from './fragments/view/view.component';

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
