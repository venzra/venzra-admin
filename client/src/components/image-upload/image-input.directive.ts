import { Directive, ElementRef, Input, Self } from '@angular/core';
import { NgControl } from '@angular/forms';
import { coerceBooleanProperty } from '@angular/cdk/coercion';

import { ImageInputControl } from './image-input.control';

@Directive({
    selector: 'input[venzraImage]',
    exportAs: 'imageInput',
    providers: [{ provide: ImageInputControl, useExisting: ImageInputDirective }]
})
export class ImageInputDirective implements ImageInputControl {

    protected _required: boolean;

    @Input() placeholder = '';

    @Input()
    get required() { return this._required; }
    set required(value: any) { this._required = coerceBooleanProperty(value); }

    constructor(
        protected element: ElementRef,
        @Self() public ngControl: NgControl
    ) {
        this.element.nativeElement.style.display = 'none';
    }

    hasError(): boolean {
        let errors = [];

        if (this.ngControl.errors) {
            errors = Object.keys(this.ngControl.errors).filter((validator) => this.ngControl.errors[validator] && this.ngControl.hasError(validator));
        }

        return errors.length > 0;
    }

}
