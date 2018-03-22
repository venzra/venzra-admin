import { AfterContentInit, Directive, ElementRef, Host, OnDestroy, Self } from '@angular/core';
import { NgControl } from '@angular/forms';

import { MarkdownComponent } from './markdown.component';
import { MarkdownInputControl } from './markdown-input.control';

@Directive({
    selector: 'textarea[venzraMarkdownInput]',
    exportAs: 'markdownControl',
    providers: [{ provide: MarkdownInputControl, useExisting: MarkdownInputDirective }]
})
export class MarkdownInputDirective implements MarkdownInputControl, AfterContentInit, OnDestroy {

    private parentChanges;

    constructor(
        protected element: ElementRef,
        @Host() public container: MarkdownComponent,
        @Self() public ngControl: NgControl
    ) { }

    ngAfterContentInit(): void {
        this.parentChanges = this.container.changeHandler.subscribe((change) => this.handleEvent(change));
    }

    ngOnDestroy(): void {
        this.parentChanges.unsubscribe();
    }

    wrapText(prefix, suffix = '', fill = '') {
        const currentValue = this.element.nativeElement.value;
        const start = this.element.nativeElement.selectionStart;
        const end = this.element.nativeElement.selectionEnd;

        const targetText = start !== end ? currentValue.substring(start, end) : fill;
        const formattedText = prefix + targetText + suffix;

        this.ngControl.control.setValue(currentValue ? currentValue.substring(0, start) + formattedText + currentValue.substring(end) : formattedText);

        this.element.nativeElement.selectionStart = start + prefix.length;
        this.element.nativeElement.selectionEnd = this.element.nativeElement.selectionStart + targetText.length;

        this.element.nativeElement.focus();
    }

    handleEvent(event) {
        switch (event) {
            case 'title':
                this.wrapText('# ', '', 'heading');
                break;
            case 'heading':
                this.wrapText('## ', '', 'heading');
                break;
            case 'subheading':
                this.wrapText('### ', '', 'heading');
                break;
            case 'bold':
                this.wrapText('**', '**', 'bold');
                break;
            case 'italic':
                this.wrapText('*', '*', 'italic');
                break;
            case 'bullets':
                this.wrapText('- ', 'list item');
                break;
            case 'link':
                this.wrapText('[Link Text](', ')', 'http://');
                break;
            default:
                this.ngControl.control.setValue(event);
        }
    }

}
