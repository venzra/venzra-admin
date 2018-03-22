import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const EMAIL_REGEX = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

@Component({
    templateUrl: './manage.component.html'
})
export class ContentContactManageComponent implements OnInit {

    public contactForm: FormGroup;

    constructor(
        private forms: FormBuilder
    ) { }

    ngOnInit(): void {
        this.contactForm = this.forms.group({
            recipient: [null, [Validators.pattern(EMAIL_REGEX)]],
            fields: [['NAME', 'EMAIL', 'MESSAGE'], []]
        });
    }

    updateContact(): void {
        console.log(this.contactForm.getRawValue());
    }
}
