import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule, MatProgressBarModule } from '@angular/material';

import { ImageInputDirective } from './image-input.directive';
import { ImageUploadComponent } from './image-upload.component';

@NgModule({
    declarations: [
        ImageInputDirective,
        ImageUploadComponent
    ],
    imports: [
        CommonModule,
        MatIconModule,
        MatProgressBarModule,
        FlexLayoutModule
    ],
    exports: [
        ImageInputDirective,
        ImageUploadComponent
    ]
})
export class ImageInputModule {
}
