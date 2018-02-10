import { Directive, ElementRef, Host, HostListener, Input } from '@angular/core';

import { MarkdownFormatControl } from './markdown-format.control';
import { MarkdownComponent } from './markdown.component';

@Directive({
    selector: 'button[venzraControl]',
    exportAs: 'markdownFormat',
    providers: [{ provide: MarkdownFormatControl, useExisting: MarkdownFormatDirective }]
})
export class MarkdownFormatDirective implements MarkdownFormatControl {

    @Input() format;

    constructor(
        protected element: ElementRef,
        @Host() public container: MarkdownComponent
    ) { }

    @HostListener('click', ['$event'])
    onClick(event: any) {
        event.preventDefault();
        this.container.changeHandler.next(this.format);
    }

}
