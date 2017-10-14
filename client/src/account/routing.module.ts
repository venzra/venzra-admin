import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { SubscriptionComponent } from './components/subscription/subscription.component';
import { SubscriptionRetrieveResolve } from './services/subscription.service';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: SubscriptionComponent,
                resolve: {
                    subscription: SubscriptionRetrieveResolve
                }
            }
        ]
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
