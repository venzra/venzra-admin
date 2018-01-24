import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MarkdownFormatDirective } from './markdown-format.directive';
import { MarkdownInputDirective } from './markdown-input.directive';
import { MarkdownDirective } from './markdown.directive';
import { MarkdownComponent } from './markdown.component';

@NgModule({
    declarations: [
        MarkdownComponent,
        MarkdownDirective,
        MarkdownFormatDirective,
        MarkdownInputDirective
    ],
    imports: [
        CommonModule,
        FlexLayoutModule
    ],
    exports: [
        MarkdownComponent,
        MarkdownDirective,
        MarkdownFormatDirective,
        MarkdownInputDirective
    ]
})
export class MarkdownModule {
}
