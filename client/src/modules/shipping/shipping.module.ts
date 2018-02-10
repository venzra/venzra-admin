import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatInputModule, MatPaginatorModule, MatProgressSpinnerModule, MatSnackBarModule, MatSortModule, MatTableModule, MatToolbarModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PageModule } from 'components/page/page.module';
import { FiltersModule } from 'filters/filters.module';

import { ShippingRoutingModule } from './routing.module';

import { ShippingListComponent } from './fragments/list/list.component';
import { ShippingCreateComponent } from './fragments/create/create.component';
import { RemoveShippingDialogComponent } from './fragments/list/remove/remove.dialog';

@NgModule({
    declarations: [
        ShippingListComponent,
        ShippingCreateComponent,
        RemoveShippingDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatPaginatorModule,
        MatProgressSpinnerModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatToolbarModule,
        FlexLayoutModule,
        ShippingRoutingModule,
        PageModule,
        FiltersModule
    ],
    entryComponents: [
        RemoveShippingDialogComponent
    ]
})
export class ShippingModule {
}
