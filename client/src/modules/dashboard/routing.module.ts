import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardComponent } from './fragments/dashboard/dashboard.component';

import { SubscriptionRetrieveResolve, SubscriptionService } from './services/subscription.service';
import { HighlightsResolve, OrderStatesResolve, OrderVolumeResolve, StatisticsService } from './services/statistics.service';

const routes: Routes = [
    {
        path: '',
        component: DashboardComponent,
        resolve: {
            subscription: SubscriptionRetrieveResolve,
            highlights: HighlightsResolve,
            orderVolumes: OrderVolumeResolve,
            orderStates: OrderStatesResolve
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
        SubscriptionRetrieveResolve,
        StatisticsService,
        HighlightsResolve,
        OrderVolumeResolve,
        OrderStatesResolve
    ]
})
export class DashboardRoutingModule {
}
