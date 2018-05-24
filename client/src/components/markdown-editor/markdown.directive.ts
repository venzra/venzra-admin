import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
    selector: '[venzraMarkdown]',
    exportAs: 'markdown'
})
export class MarkdownDirective implements OnChanges {

    private _original: string;

    private marked = (<any>window).marked;

    @Input() venzraMarkdown: string;

    @Input() headers: 'none' | 'simple' | 'full' = 'none';

    constructor(
        protected element: ElementRef
    ) { }

    ngOnChanges(): void {
        this.marked.setOptions({
            gfm: true,
            sanitize: true
        });

        if (!this._original) {
            this._original = this.element.nativeElement.innerHTML;
        }

        if (this.venzraMarkdown) {
            this.element.nativeElement.innerHTML = this.marked(this.venzraMarkdown, { renderer: this.materialRender() });
        } else {
            this.element.nativeElement.innerHTML = this._original;
        }
    }

    materialRender() {
        const renderer = new this.marked.Renderer();

        switch (this.headers) {
            case 'none':
                renderer['heading'] = (text, level) => `<p>${text}</p>`;
                break;
            case 'simple':
                renderer['heading'] = (text, level) => `<h3>${text}</h3>`;
        }

        renderer['link'] = (href, title, text) => {
            return `<a href="${href}" target="_blank" ${title ? `title="${title}"` : ''}>${text}</a>`;
        };

        return renderer;
    }

}
