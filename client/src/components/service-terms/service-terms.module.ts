import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatDialogModule } from '@angular/material';

import { ServiceTermsComponent } from './service-terms.component';


@NgModule({
    declarations: [
        ServiceTermsComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        FlexLayoutModule
    ],
    exports: [
        ServiceTermsComponent
    ],
    entryComponents: [
        ServiceTermsComponent
    ]
})
export class ServiceTermsModule {
}
