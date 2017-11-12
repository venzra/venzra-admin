import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatListModule, MatPaginatorModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule, MatToolbarModule, MatTooltipModule } from '@angular/material';

import { PricePipe } from './filters/price.pipe';

import { ErrorInterceptorModule } from './http.interceptor';

@NgModule({
    declarations: [
        PricePipe,
    ],
    imports: [
        HttpClientModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatPaginatorModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatTooltipModule,
        ErrorInterceptorModule
    ],
    exports: [
        HttpClientModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatPaginatorModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatTooltipModule,
        ErrorInterceptorModule,
        PricePipe
    ]
})
export class VenzraCommonModule {
}
