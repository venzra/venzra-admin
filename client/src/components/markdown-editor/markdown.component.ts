import { AfterContentInit, Component, ContentChild, Input } from '@angular/core';

import { Subject } from 'rxjs/Subject';
import { MarkdownInputControl } from './markdown-input.control';

@Component({
    selector: 'venzra-markdown-editor',
    templateUrl: './markdown.component.html',
    styleUrls: ['./markdown.component.scss']
})
export class MarkdownComponent implements AfterContentInit {

    public content;
    public changeHandler: Subject<any> = new Subject<any>();

    @Input() headers: 'none' | 'simple' | 'full' = 'none';

    @ContentChild(MarkdownInputControl) control: MarkdownInputControl;

    constructor(
    ) { }

    ngAfterContentInit(): void {
        this.content = this.control.ngControl.control.value;
        this.control.ngControl.control.valueChanges.subscribe((change) => this.content = change);
    }
}
