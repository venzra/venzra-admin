import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ProductListComponent } from './components/list/list.component';
import { ProductCreateComponent } from './components/create/create.component';

import { ProductListResolve } from '../../services/product.service';

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
