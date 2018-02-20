import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule, MatDialogModule } from '@angular/material';

import { MarkdownHelpComponent } from './markdown-help.component';

@NgModule({
    declarations: [
        MarkdownHelpComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatDialogModule,
        FlexLayoutModule
    ],
    exports: [
        MarkdownHelpComponent
    ],
    entryComponents: [
        MarkdownHelpComponent
    ]
})
export class MarkdownHelpModule {
}
