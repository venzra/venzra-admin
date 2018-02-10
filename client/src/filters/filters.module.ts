import { NgModule } from '@angular/core';

import { NonePipe } from './none.pipe';
import { PricePipe } from './price.pipe';
import { ShippingPipe } from './shipping.pipe';

@NgModule({
    declarations: [
        NonePipe,
        PricePipe,
        ShippingPipe
    ],
    exports: [
        NonePipe,
        PricePipe,
        ShippingPipe
    ]
})
export class FiltersModule {
}
