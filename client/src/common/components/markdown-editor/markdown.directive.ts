import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

@Directive({
    selector: '[venzraMarkdown]',
    exportAs: 'markdown'
})
export class MarkdownDirective implements OnChanges {

    private _headers: boolean;

    private marked = (<any>window).marked;

    @Input() venzraMarkdown: string;

    @Input()
    get headers() { return this._headers; }
    set headers(value: any) { this._headers = coerceBooleanProperty(value); }

    constructor(
        protected element: ElementRef
    ) { }

    ngOnChanges(): void {
        this.marked.setOptions({
            gfm: true,
            sanitize: true
        });

        if (this.venzraMarkdown) {
            this.element.nativeElement.innerHTML = this.marked(this.venzraMarkdown, { renderer: this.materialRender() });
        }
    }

    materialRender() {
        const renderer = new this.marked.Renderer();

        if (!this._headers) {
            renderer['heading'] = (text, level) => `<p>${text}</p>`;
        }

        renderer['link'] = (href, title, text) => {
            return `<a href="${href}" target="_blank" ${title ? `title="${title}"` : ''}>${text}</a>`;
        };

        return renderer;
    }

}
