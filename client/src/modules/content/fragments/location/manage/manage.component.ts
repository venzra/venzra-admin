import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { Location } from '../../../models/location';
import { LocationService } from '../../../services/location.service';

@Component({
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ContentLocationManageComponent implements OnInit {

    public location: Location;
    public locationForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private locationService: LocationService
    ) { }

    ngOnInit(): void {
        this.location = this.route.snapshot.data.location;

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

        this.locationForm.reset(this.location);
    }

    updateLocation(): void {
        this.locationService.updateLocation(this.location._id, this.locationForm.controls)
            .then(() => this.router.navigate(['/content/locations']))
            .catch((error) => this.snackbar.open(error.message || 'Update failed', 'OK', { duration: 5000 }));
    }
}
