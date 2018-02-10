import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ShippingListComponent } from './fragments/list/list.component';
import { ShippingCreateComponent } from './fragments/create/create.component';

import { ShippingListResolve, ShippingService } from './services/shipping.service';

const routes: Routes = [
    {
        path: '',
        component: ShippingListComponent,
        resolve: {
            shippingData: ShippingListResolve
        }
    },
    {
        path: 'create',
        component: ShippingCreateComponent,
        resolve: {
            shippingData: ShippingListResolve
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        ShippingService,
        ShippingListResolve
    ]
})
export class ShippingRoutingModule {
}
