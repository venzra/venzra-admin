import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VenzraCommonModule } from '../../common/common.module';
import { AccountRoutingModule } from './routing.module';

import { SettingsComponent } from './components/settings/settings.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { GatewayComponent } from './components/gateway/gateway.component';
import { ServiceTermsComponent } from './components/service-terms/service-terms.component';

import { GatewayService } from '../../services/gateway.service';
import { SubscriptionRetrieveResolve, SubscriptionService } from '../../services/subscription.service';

@NgModule({
    declarations: [
        SettingsComponent,
        SubscriptionComponent,
        GatewayComponent
    ],
    imports: [
        CommonModule,
        VenzraCommonModule,
        AccountRoutingModule
    ],
    providers: [
        GatewayService,
        SubscriptionService,
        SubscriptionRetrieveResolve
    ]
})
export class AccountModule {
}
