import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material';

import { AccountComponent } from './account.component';


@NgModule({
    declarations: [
        AccountComponent
    ],
    imports: [
        CommonModule,
        MatIconModule,
        FlexLayoutModule
    ],
    exports: [
        AccountComponent
    ]
})
export class AccountModule {
}
