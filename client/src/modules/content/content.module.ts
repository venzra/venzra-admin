import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_FORMATS, MatButtonModule, MatCardModule, MatCheckboxModule, MatDatepickerModule, MatExpansionModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatSnackBarModule, MatTooltipModule, NativeDateModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ContentRoutingModule } from './routing.module';

import { ImageInputModule } from '@venzra/components/image-upload/image-input.module';
import { MarkdownModule } from '@venzra/components/markdown-editor/markdown.module';
import { PageModule } from '@venzra/components/page/page.module';
import { FiltersModule } from '@venzra/filters/filters.module';

import { ContentListComponent } from './fragments/list/list.component';

import { ContentAboutComponent } from './fragments/about/about.component';

import { ContentCareersComponent } from './fragments/careers/careers.component';
import { ContentCareersCreateComponent } from './fragments/careers/create/create.component';
import { ContentCareersManageComponent } from './fragments/careers/manage/manage.component';
import { RemoveCareerDialogComponent } from './fragments/careers/remove/remove.dialog';

import { ContentContactComponent } from './fragments/contact/contact.component';
import { ContentContactManageComponent } from './fragments/contact/manage.component';

import { ContentLocationComponent } from './fragments/location/location.component';
import { ContentLocationManageComponent } from './fragments/location/manage.component';

import { ContentPrivacyComponent } from './fragments/privacy/privacy.component';

import { ContentTermsComponent } from './fragments/terms/terms.component';

const VENZRA_FORMAT = {
    parse: {
        dateInput: { month: 'long', year: 'numeric', day: 'numeric' }
    },
    display: {
        dateInput: { month: 'long', year: 'numeric', day: 'numeric' },
        monthYearLabel: { year: 'numeric', month: 'short' },
        dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
        monthYearA11yLabel: { year: 'numeric', month: 'long' }
    }
};

@NgModule({
    declarations: [
        ContentListComponent,
        ContentAboutComponent,
        ContentCareersComponent,
        ContentCareersCreateComponent,
        ContentCareersManageComponent,
        ContentContactComponent,
        ContentContactManageComponent,
        ContentLocationComponent,
        ContentLocationManageComponent,
        ContentPrivacyComponent,
        ContentTermsComponent,
        RemoveCareerDialogComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatExpansionModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatSnackBarModule,
        MatTooltipModule,
        NativeDateModule,
        FlexLayoutModule,
        ImageInputModule,
        MarkdownModule,
        FiltersModule,
        PageModule,
        ContentRoutingModule
    ],
    providers: [
        { provide: MAT_DATE_FORMATS, useValue: VENZRA_FORMAT }
    ],
    entryComponents: [
        RemoveCareerDialogComponent
    ]
})
export class ContentModule {
}
