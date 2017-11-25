import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './components/settings/settings.component';
import { GatewayComponent } from './components/gateway/gateway.component';

import { SubscriptionRetrieveResolve } from '../../services/subscription.service';
import { PlanListResolve } from '../../services/plan.service';

const routes: Routes = [
    {
        path: '',
        component: SettingsComponent,
        resolve: {
            subscription: SubscriptionRetrieveResolve,
            plans: PlanListResolve
        }
    },
    {
        path: 'gateway',
        component: GatewayComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AccountRoutingModule {
}
