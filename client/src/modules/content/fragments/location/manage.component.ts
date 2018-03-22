import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ContentLocationManageComponent implements OnInit {

    public locationForm: FormGroup;

    constructor(
        private forms: FormBuilder
    ) { }

    ngOnInit(): void {
        this.locationForm = this.forms.group({
            name: [null, [Validators.required, Validators.maxLength(120)]],
            description: [null, [Validators.required, Validators.maxLength(1000)]],
            featureImage: [null, []],
            address: [null, [Validators.required, Validators.maxLength(200)]],
            postalCode: [null, [Validators.required, Validators.maxLength(12)]]
        });
    }

    addLocation(): void {
        console.log(this.locationForm.getRawValue());
    }
}
