import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ProductCreateComponent } from './components/create/create.component';
import { ProductListComponent } from './components/list/list.component';
import { ProductViewComponent } from './components/view/view.component';

import { ProductListResolve, ProductRetrieveResolve } from '../../services/product.service';

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
