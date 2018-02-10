import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './fragments/dashboard/dashboard.component';

import { SubscriptionRetrieveResolve, SubscriptionService } from './services/subscription.service';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
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
        SubscriptionService,
        SubscriptionRetrieveResolve
    ]
})
export class DashboardRoutingModule {
}
