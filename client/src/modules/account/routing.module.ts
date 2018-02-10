import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { GatewayComponent } from './fragments/gateway/gateway.component';
import { SubscriptionComponent } from './fragments/subscription/subscription.component';

import { PlanListResolve } from './services/plan.service';
import { SubscriptionRetrieveResolve } from './services/subscription.service';

const routes: Routes = [
    {
        path: 'subscription',
        component: SubscriptionComponent,
        resolve: {
            subscription: SubscriptionRetrieveResolve,
            plans: PlanListResolve
        }
    },
    {
        path: 'gateway',
        component: GatewayComponent,
        resolve: {
            subscription: SubscriptionRetrieveResolve
        }
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        PlanListResolve,
        SubscriptionRetrieveResolve
    ]
})
export class AccountRoutingModule {
}
