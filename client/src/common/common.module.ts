import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatListModule, MatPaginatorModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule, MatToolbarModule, MatTooltipModule } from '@angular/material';

import { AccountComponent } from './components/account/account.component';
import { ServiceTermsComponent } from './components/service-terms/service-terms.component';

import { PricePipe } from './filters/price.pipe';

import { ErrorInterceptorModule } from './http.interceptor';

@NgModule({
    declarations: [
        PricePipe,
        AccountComponent,
        ServiceTermsComponent
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
        PricePipe,
        AccountComponent
    ],
    entryComponents: [
        ServiceTermsComponent
    ]
})
export class VenzraCommonModule {
}
