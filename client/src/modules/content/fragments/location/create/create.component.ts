import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { LocationService } from '../../../services/location.service';

@Component({
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class ContentLocationCreateComponent implements OnInit {

    public locationForm: FormGroup;

    constructor(
        private router: Router,
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private locationService: LocationService
    ) { }

    ngOnInit(): void {
        this.locationForm = this.forms.group({
            displayName: [null, [Validators.required, Validators.maxLength(120)]],
            description: [null, [Validators.required, Validators.maxLength(2000)]],
            usage: ['BUSINESS', [Validators.required]],
            address: this.forms.group({
                addressee: ['', [Validators.required, Validators.maxLength(80)]],
                street: ['', [Validators.required, Validators.maxLength(50)]],
                building: ['', [Validators.maxLength(50)]],
                city: ['', [Validators.maxLength(50)]],
                county: ['', [Validators.required, Validators.maxLength(50)]],
                postalCode: ['', [Validators.required, Validators.maxLength(12)]],
                country: ['GB', [Validators.required]]
            }),
            featureImage: [null, []]
        });
    }

    addLocation(): void {
        const location = this.locationForm.getRawValue();

        this.locationService.createLocation(location)
            .then(() => this.router.navigate(['/content/locations']))
            .catch((error) => this.snackbar.open(error.message || 'Create failed', 'OK', { duration: 5000 }));
    }
}
