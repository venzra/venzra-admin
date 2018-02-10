import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BrandingComponent } from './fragments/branding/branding.component';

import { SubscriptionRetrieveResolve, SubscriptionService } from './services/subscription.service';

const routes: Routes = [
    {
        path: 'branding',
        component: BrandingComponent,
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
export class StoreRoutingModule {
}
