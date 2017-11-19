import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { VenzraCommonModule } from './common/common.module';
import { VenzraRoutingModule } from './routing.module';

import { VenzraComponent } from './venzra.component';
import { PrivateComponent } from './private.component';
import { PublicComponent } from './public.component';

import { AccountService } from './services/account.service';
import { LayoutService } from './services/layout.service';

@NgModule({
    declarations: [
        VenzraComponent,
        PrivateComponent,
        PublicComponent
    ],
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        VenzraCommonModule,
        VenzraRoutingModule
    ],
    exports: [
        BrowserAnimationsModule
    ],
    providers: [
        AccountService,
        LayoutService
    ],
    bootstrap: [VenzraComponent]
})
export class VenzraModule {
}
