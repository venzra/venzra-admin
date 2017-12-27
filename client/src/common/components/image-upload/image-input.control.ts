import {NgControl} from '@angular/forms';

export abstract class ImageInputControl {

    readonly placeholder: string;

    readonly required: boolean;

    readonly ngControl: NgControl;

    abstract hasError(): boolean;

}
