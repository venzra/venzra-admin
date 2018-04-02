import { NgModule } from '@angular/core';

import { AddressPipe } from './address.pipe';
import { NonePipe } from './none.pipe';
import { PricePipe } from './price.pipe';
import { ShippingPipe } from './shipping.pipe';

@NgModule({
    declarations: [
        AddressPipe,
        NonePipe,
        PricePipe,
        ShippingPipe
    ],
    exports: [
        AddressPipe,
        NonePipe,
        PricePipe,
        ShippingPipe
    ]
})
export class FiltersModule {
}
