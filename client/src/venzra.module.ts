import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatDialogModule, MatDividerModule, MatIconModule, MatListModule, MatSidenavModule, MatToolbarModule } from '@angular/material';

import { VenzraRoutingModule } from './routing.module';

import { AccountService, ErrorInterceptorModule, LayoutService, RouteReuseModule } from '@venzra/services';

import { AccountModule } from './components/account/account.module';

import { VenzraComponent } from './venzra.component';
import { PublicComponent } from './site/public/public.component';
import { PrivateComponent } from './site/private/private.component';

@NgModule({
    declarations: [
        VenzraComponent,
        PublicComponent,
        PrivateComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        BrowserAnimationsModule,
        VenzraRoutingModule,
        MatButtonModule,
        MatDialogModule,
        MatDividerModule,
        MatIconModule,
        MatListModule,
        MatSidenavModule,
        MatToolbarModule,
        FlexLayoutModule,
        AccountModule,
        RouteReuseModule,
        ErrorInterceptorModule
    ],
    exports: [
        BrowserAnimationsModule,
        RouteReuseModule,
        ErrorInterceptorModule
    ],
    providers: [
        AccountService,
        LayoutService
    ],
    bootstrap: [VenzraComponent]
})
export class VenzraModule {
}
