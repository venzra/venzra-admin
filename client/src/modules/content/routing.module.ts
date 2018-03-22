import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ContentRetrieveService, ContentService } from './services/content.service';
import { SubscriptionRetrieveResolve } from './services/subscription.service';

import { ContentListComponent } from './fragments/list/list.component';
import { ContentAboutComponent } from './fragments/about/about.component';
import { ContentCareersComponent } from './fragments/careers/careers.component';
import { ContentCareersManageComponent } from './fragments/careers/manage.component';
import { ContentContactComponent } from './fragments/contact/contact.component';
import { ContentContactManageComponent } from './fragments/contact/manage.component';
import { ContentLocationComponent } from './fragments/location/location.component';
import { ContentLocationManageComponent } from './fragments/location/manage.component';
import { ContentPrivacyComponent } from './fragments/privacy/privacy.component';
import { ContentTermsComponent } from './fragments/terms/terms.component';

const routes: Routes = [
    {
        path: '',
        component: ContentListComponent,
        resolve: {
            subscription: SubscriptionRetrieveResolve
        }
    },
    {
        path: 'about',
        component: ContentAboutComponent,
        data: { usage: 'about' },
        resolve: {
            content: ContentRetrieveService,
            subscription: SubscriptionRetrieveResolve
        }
    },
    {
        path: 'careers',
        component: ContentCareersComponent,
        data: { usage: 'careers' },
        resolve: {
            content: ContentRetrieveService,
            subscription: SubscriptionRetrieveResolve
        }
    },
    // {
    //     path: 'careers/manage',
    //     component: ContentCareersManageComponent,
    //     resolve: {
    //         subscription: SubscriptionRetrieveResolve
    //     }
    // },
    {
        path: 'contact',
        component: ContentContactComponent,
        data: { usage: 'contact' },
        resolve: {
            content: ContentRetrieveService,
            subscription: SubscriptionRetrieveResolve
        }
    },
    // {
    //     path: 'contact/manage',
    //     component: ContentContactManageComponent,
    //     resolve: {
    //         subscription: SubscriptionRetrieveResolve
    //     }
    // },
    {
        path: 'locations',
        component: ContentLocationComponent,
        data: { usage: 'location' },
        resolve: {
            content: ContentRetrieveService,
            subscription: SubscriptionRetrieveResolve
        }
    },
    // {
    //     path: 'locations/manage',
    //     component: ContentLocationManageComponent,
    //     resolve: {
    //         subscription: SubscriptionRetrieveResolve
    //     }
    // },
    // {
    //     path: 'privacy',
    //     component: ContentPrivacyComponent,
    //     resolve: {
    //         subscription: SubscriptionRetrieveResolve
    //     }
    // },
    {
        path: 'terms',
        component: ContentTermsComponent,
        data: { usage: 'terms' },
        resolve: {
            content: ContentRetrieveService,
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
        ContentService,
        ContentRetrieveService,
        SubscriptionRetrieveResolve
    ]
})
export class ContentRoutingModule {
}
