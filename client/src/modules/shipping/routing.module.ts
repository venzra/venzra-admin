import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { ShippingCreateComponent } from './components/create/create.component';
import { ShippingListComponent } from './components/list/list.component';

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
        component: ShippingCreateComponent
    },
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
