import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VenzraCommonModule } from '../../common/common.module';
import { AccountRoutingModule } from './routing.module';

import { OrderListComponent } from './components/list/list.component';
import { OrderViewComponent } from './components/view/view.component';
import { OrderStatusDialogComponent } from './components/view/status/status.component';

import { OrderListResolve, OrderRetrieveResolve, OrderService } from '../../services/order.service';

@NgModule({
    declarations: [
        OrderListComponent,
        OrderViewComponent,
        OrderStatusDialogComponent
    ],
    imports: [
        CommonModule,
        VenzraCommonModule,
        AccountRoutingModule
    ],
    providers: [
        OrderService,
        OrderListResolve,
        OrderRetrieveResolve
    ],
    entryComponents: [
        OrderStatusDialogComponent
    ]
})
export class OrdersModule {
}
