import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { StorePageComponent } from './pages/store/store.page';
import { PaymentPageComponent } from './pages/payments/payments.page';

import { SubscriptionRetrieveResolve } from '../../services/subscription.service';
import { PlanListResolve } from '../../services/plan.service';

const routes: Routes = [
    {
        path: 'store',
        component: StorePageComponent,
        resolve: {
            subscription: SubscriptionRetrieveResolve
        }
    },
    {
        path: 'payments',
        component: PaymentPageComponent,
        resolve: {
            subscription: SubscriptionRetrieveResolve,
            plans: PlanListResolve
        }
    },
    {
        path: '',
        redirectTo: 'store',
        pathMatch: 'full'
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
