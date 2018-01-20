import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { OrderListComponent } from './components/list/list.component';

import { OrderListResolve, OrderRetrieveResolve } from '../../services/order.service';
import { OrderViewComponent } from './components/view/view.component';

const routes: Routes = [
    {
        path: '',
        component: OrderListComponent,
        resolve: {
            orderData: OrderListResolve
        }
    },
    {
        path: ':orderId',
        component: OrderViewComponent,
        resolve: {
            orderData: OrderRetrieveResolve
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
