import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VenzraCommonModule } from '../../common/common.module';
import { ErrorsRoutingModule } from './routing.module';

import { NotFoundComponent } from './components/not-found/not-found.component';

@NgModule({
    declarations: [
        NotFoundComponent
    ],
    imports: [
        CommonModule,
        VenzraCommonModule,
        ErrorsRoutingModule
    ]
})
export class ErrorsModule {
}
