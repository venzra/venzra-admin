import { AfterContentInit, Component, ContentChild } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { MarkdownInputControl } from './markdown-input.control';

@Component({
    selector: 'venzra-markdown-editor',
    templateUrl: './markdown.component.html',
    styleUrls: ['./markdown.component.scss']
})
export class MarkdownComponent implements AfterContentInit {

    public content;
    public help = false;
    public preview = false;
    public changeHandler: Subject<any> = new Subject<any>();

    @ContentChild(MarkdownInputControl) control: MarkdownInputControl;

    constructor(
    ) { }

    ngAfterContentInit(): void {
        this.control.ngControl.control.valueChanges.subscribe((change) => this.content = change);
    }

    toggleHelp() {
        this.preview = false;
        this.help = !this.help;
    }

    togglePreview() {
        this.help = false;
        this.preview = !this.preview;
    }
}
