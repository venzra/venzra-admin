import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CareerListResolve, CareerRetrieveResolve, CareerService } from './services/career.service';
import { ContentRetrieveResolve, ContentService } from './services/content.service';
import { LocationListResolve, LocationRetrieveResolve, LocationService } from './services/location.service';
import { SubscriptionRetrieveResolve } from './services/subscription.service';

import { ContentListComponent } from './fragments/list/list.component';
import { ContentAboutComponent } from './fragments/about/about.component';
import { ContentCareersComponent } from './fragments/careers/careers.component';
import { ContentCareersCreateComponent } from './fragments/careers/create/create.component';
import { ContentCareersManageComponent } from './fragments/careers/manage/manage.component';
import { ContentContactComponent } from './fragments/contact/contact.component';
import { ContentContactManageComponent } from './fragments/contact/manage.component';
import { ContentLocationComponent } from './fragments/location/location.component';
import { ContentLocationCreateComponent } from './fragments/location/create/create.component';
import { ContentLocationManageComponent } from './fragments/location/manage/manage.component';
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
            content: ContentRetrieveResolve,
            subscription: SubscriptionRetrieveResolve
        }
    },
    {
        path: 'careers',
        component: ContentCareersComponent,
        data: { usage: 'careers' },
        resolve: {
            careers: CareerListResolve,
            content: ContentRetrieveResolve,
            subscription: SubscriptionRetrieveResolve
        }
    },
    {
        path: 'careers/create',
        component: ContentCareersCreateComponent
    },
    {
        path: 'careers/:careerId',
        component: ContentCareersManageComponent,
        resolve: {
            career: CareerRetrieveResolve
        }
    },
    {
        path: 'contact',
        component: ContentContactComponent,
        data: { usage: 'contact' },
        resolve: {
            content: ContentRetrieveResolve,
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
            locations: LocationListResolve,
            content: ContentRetrieveResolve,
            subscription: SubscriptionRetrieveResolve
        }
    },
    {
        path: 'locations/create',
        component: ContentLocationCreateComponent
    },
    {
        path: 'locations/:locationId',
        component: ContentLocationManageComponent,
        resolve: {
            location: LocationRetrieveResolve
        }
    },
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
            content: ContentRetrieveResolve,
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
        CareerService,
        CareerRetrieveResolve,
        CareerListResolve,
        ContentService,
        ContentRetrieveResolve,
        LocationService,
        LocationRetrieveResolve,
        LocationListResolve,
        SubscriptionRetrieveResolve
    ]
})
export class ContentRoutingModule {
}
