import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatDialogModule, MatIconModule, MatInputModule, MatListModule, MatMenuModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatRadioModule, MatSelectModule, MatSidenavModule, MatSlideToggleModule, MatSnackBarModule, MatSortModule, MatStepperModule, MatTableModule, MatToolbarModule, MatTooltipModule } from '@angular/material';

import { AccountComponent } from './components/account/account.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';
import { ImageInputDirective } from './components/image-upload/image-input.directive';
import { ServiceTermsComponent } from './components/service-terms/service-terms.component';

import { PricePipe } from './filters/price.pipe';

import { ErrorInterceptorModule } from './http.interceptor';
import { MarkdownModule } from './components/markdown-editor/markdown.module';

@NgModule({
    declarations: [
        PricePipe,
        AccountComponent,
        ImageUploadComponent,
        ImageInputDirective,
        ServiceTermsComponent
    ],
    imports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatStepperModule,
        MatTableModule,
        MatToolbarModule,
        MatTooltipModule,
        MarkdownModule,
        ErrorInterceptorModule
    ],
    exports: [
        CommonModule,
        HttpClientModule,
        ReactiveFormsModule,
        FlexLayoutModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDialogModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatPaginatorModule,
        MatRadioModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatSidenavModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatStepperModule,
        MatTableModule,
        MatToolbarModule,
        MatTooltipModule,
        MarkdownModule,
        ErrorInterceptorModule,
        PricePipe,
        AccountComponent,
        ImageUploadComponent,
        ImageInputDirective,
    ],
    entryComponents: [
        ServiceTermsComponent
    ]
})
export class VenzraCommonModule {
}
