import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { SetupPage } from './pages/setup/setup.page';
import { GatewayComponent } from './components/gateway/gateway.component';

import { SubscriptionRetrieveResolve } from '../../services/subscription.service';
import { PlanListResolve } from '../../services/plan.service';

const routes: Routes = [
    {
        path: '',
        component: SetupPage,
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
