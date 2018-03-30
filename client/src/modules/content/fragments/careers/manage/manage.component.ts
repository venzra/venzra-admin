import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { Career } from '../../../models/career';
import { CareerService } from '../../../services/career.service';

@Component({
    templateUrl: './manage.component.html',
    styleUrls: ['./manage.component.scss']
})
export class ContentCareersManageComponent implements OnInit {

    public career: Career;
    public careerForm: FormGroup;
    public minDate = new Date();
    public maxDate = new Date(new Date().setMonth(new Date().getMonth() + 3));

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private careerService: CareerService
    ) { }

    ngOnInit(): void {
        this.career = this.route.snapshot.data.career;

        this.careerForm = this.forms.group({
            position: [null, [Validators.required, Validators.maxLength(120)]],
            description: [null, [Validators.required, Validators.maxLength(5000)]],
            expires: [new Date(new Date().setMonth(new Date().getMonth() + 1)), [Validators.required]]
        });

        if (new Date(this.career.expires) < this.minDate) {
            this.minDate = new Date(this.career.expires);
        }

        this.careerForm.reset(this.career);
    }

    updateCareer(): void {
        this.careerService.updateCareer(this.career._id, this.careerForm.controls)
            .then(() => this.router.navigate(['/content/careers']))
            .catch((error) => this.snackbar.open(error.message || 'Update failed', 'OK', { duration: 5000 }));
    }
}
