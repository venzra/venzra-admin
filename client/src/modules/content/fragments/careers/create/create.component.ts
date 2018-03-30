import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { CareerService } from '../../../services/career.service';

@Component({
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class ContentCareersCreateComponent implements OnInit {

    public careerForm: FormGroup;
    public minDate = new Date();
    public maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

    constructor(
        private router: Router,
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private careerService: CareerService
    ) { }

    ngOnInit(): void {
        this.careerForm = this.forms.group({
            position: [null, [Validators.required, Validators.maxLength(120)]],
            description: [null, [Validators.required, Validators.maxLength(5000)]],
            expires: [new Date(new Date().setMonth(new Date().getMonth() + 1)), [Validators.required]]
        });
    }

    addCareer(): void {
        const career = this.careerForm.getRawValue();

        this.careerService.createCareer(career)
            .then(() => this.router.navigate(['/content/careers']))
            .catch((error) => this.snackbar.open(error.message || 'Create failed', 'OK', { duration: 5000 }));
    }
}
