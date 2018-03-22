import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ContentCareersManageComponent implements OnInit {

    public advertForm: FormGroup;
    public minDate = new Date();
    public maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

    constructor(
        private forms: FormBuilder
    ) { }

    ngOnInit(): void {
        this.advertForm = this.forms.group({
            position: [null, [Validators.required, Validators.maxLength(120)]],
            description: [null, [Validators.required, Validators.maxLength(1000)]],
            closing: [new Date(new Date().setMonth(new Date().getMonth() + 1)), [Validators.required]]
        });
    }

    addAdvert(): void {
        console.log(this.advertForm.getRawValue());
    }
}
