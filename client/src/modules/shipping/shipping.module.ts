import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VenzraCommonModule } from '../../common/common.module';
import { ShippingRoutingModule } from './routing.module';

import { ShippingCreateComponent } from './components/create/create.component';
import { ShippingListComponent } from './components/list/list.component';
import { RemoveShippingDialogComponent } from './components/list/remove/remove.dialog';

@NgModule({
    declarations: [
        ShippingCreateComponent,
        ShippingListComponent,
        RemoveShippingDialogComponent
    ],
    imports: [
        CommonModule,
        VenzraCommonModule,
        ShippingRoutingModule
    ],
    entryComponents: [
        RemoveShippingDialogComponent
    ]
})
export class ShippingModule {
}
