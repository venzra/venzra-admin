import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule, MatProgressSpinnerModule, MatRadioModule, MatSnackBarModule, MatSortModule, MatTableModule, MatToolbarModule, MatTooltipModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AccountRoutingModule } from './routing.module';

import { FiltersModule } from '@venzra/filters/filters.module';
import { PageModule } from '@venzra/components/page/page.module';

import { OrderListComponent } from './fragments/list/list.component';
import { OrderViewComponent } from './fragments/view/view.component';
import { OrderStatusDialogComponent } from './fragments/view/status/status.component';

import { OrderListResolve, OrderRetrieveResolve, OrderService } from './services/order.service';

@NgModule({
    declarations: [
        OrderListComponent,
        OrderViewComponent,
        OrderStatusDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        MatTooltipModule,
        FlexLayoutModule,
        AccountRoutingModule,
        PageModule,
        FiltersModule
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
