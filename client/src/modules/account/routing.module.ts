import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './components/settings/settings.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';

import { SubscriptionRetrieveResolve } from '../../services/subscription.service';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: '',
                component: SettingsComponent,
                resolve: {
                    subscription: SubscriptionRetrieveResolve
                }
            },
            { path: 'subscription', component: SubscriptionComponent }
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
