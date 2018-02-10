import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ErrorsRoutingModule } from './routing.module';

import { NotFoundComponent } from './fragments/not-found/not-found.component';

@NgModule({
    declarations: [
        NotFoundComponent
    ],
    imports: [
        CommonModule,
        MatCardModule,
        FlexLayoutModule,
        ErrorsRoutingModule
    ]
})
export class ErrorsModule {
}
