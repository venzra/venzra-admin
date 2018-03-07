import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatIconModule, MatInputModule, MatSelectModule, MatSnackBarModule } from '@angular/material';
import { FlexLayoutModule } from '@angular/flex-layout';

import { ImageInputModule } from '@venzra/components/image-upload/image-input.module';
import { PageModule } from '@venzra/components/page/page.module';

import { StoreRoutingModule } from './routing.module';

import { BrandingComponent } from './fragments/branding/branding.component';

@NgModule({
    declarations: [
        BrandingComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
        FlexLayoutModule,
        StoreRoutingModule,
        ImageInputModule,
        PageModule
    ]
})
export class StoreModule {
}
