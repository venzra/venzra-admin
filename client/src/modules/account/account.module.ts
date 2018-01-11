import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VenzraCommonModule } from '../../common/common.module';
import { AccountRoutingModule } from './routing.module';

import { SettingsComponent } from './components/settings/settings.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { GatewayComponent } from './components/gateway/gateway.component';

import { StorePageComponent } from './pages/store/store.page';
import { PaymentPageComponent } from './pages/payments/payments.page';

import { CalendarService } from '../../services/calendar.service';
import { PaymentService } from '../../services/payment.service';
import { GatewayService } from '../../services/gateway.service';
import { SubscriptionRetrieveResolve, SubscriptionService } from '../../services/subscription.service';
import { PlanListResolve, PlanService } from '../../services/plan.service';

@NgModule({
    declarations: [
        SettingsComponent,
        SubscriptionComponent,
        GatewayComponent,
        StorePageComponent,
        PaymentPageComponent
    ],
    imports: [
        CommonModule,
        VenzraCommonModule,
        AccountRoutingModule
    ],
    providers: [
        CalendarService,
        PaymentService,
        GatewayService,
        SubscriptionService,
        SubscriptionRetrieveResolve,
        PlanService,
        PlanListResolve
    ]
})
export class AccountModule {
}
