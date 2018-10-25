import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule, MatProgressBarModule } from '@angular/material';

import { VenzraImageDirective } from '@venzra/components/image-upload/image.directive';

import { ImageInputDirective } from './image-input.directive';
import { ImageUploadComponent } from './image-upload.component';

@NgModule({
    declarations: [
        ImageInputDirective,
        VenzraImageDirective,
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
        VenzraImageDirective,
        ImageUploadComponent
    ]
})
export class ImageInputModule {
}
