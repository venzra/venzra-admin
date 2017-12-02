import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { StorePage } from './pages/store/store.page';
import { PaymentPage } from './pages/payments/payments.page';

import { SubscriptionRetrieveResolve } from '../../services/subscription.service';
import { PlanListResolve } from '../../services/plan.service';

const routes: Routes = [
    {
        path: 'store',
        component: StorePage,
        resolve: {
            subscription: SubscriptionRetrieveResolve
        }
    },
    {
        path: 'payments',
        component: PaymentPage,
        resolve: {
            subscription: SubscriptionRetrieveResolve,
            plans: PlanListResolve
        }
    },
    {
        path: '',
        redirectTo: '/account/payments',
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
