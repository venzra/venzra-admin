import { NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { VenzraCommonModule } from './common/common.module';
import { VenzraRoutingModule } from './routing.module';

import { VenzraComponent } from './venzra.component';
import { PrivateComponent } from './private.component';
import { PublicComponent } from './public.component';

import { LayoutService } from './layout.service';

@NgModule({
    declarations: [
        VenzraComponent,
        PrivateComponent,
        PublicComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        VenzraCommonModule,
        VenzraRoutingModule
    ],
    providers: [
        LayoutService
    ],
    bootstrap: [VenzraComponent]
})
export class VenzraModule {
}
