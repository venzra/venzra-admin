import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VenzraCommonModule } from '../../common/common.module';
import { AccountRoutingModule } from './routing.module';

import { SettingsComponent } from './components/settings/settings.component';
import { ServiceTermsDialog, SubscriptionComponent } from './components/subscription/subscription.component';

import { SubscriptionRetrieveResolve, SubscriptionService } from '../../services/subscription.service';

@NgModule({
    declarations: [
        SettingsComponent,
        SubscriptionComponent,
        ServiceTermsDialog
    ],
    imports: [
        CommonModule,
        VenzraCommonModule,
        AccountRoutingModule
    ],
    entryComponents: [
        ServiceTermsDialog
    ],
    providers: [
        SubscriptionService,
        SubscriptionRetrieveResolve
    ]
})
export class AccountModule {
}
