import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';

import 'rxjs/add/operator/debounceTime';

import { AccountService, Activation, LayoutService } from '@venzra/services';

import { ServiceTermsComponent } from '@venzra/components/service-terms/service-terms.component';

@Component({
    templateUrl: './activation.component.html',
    styleUrls: ['./activation.component.scss']
})
export class ActivationComponent implements OnInit {

    public account: Activation;
    public activationForm: FormGroup;
    public saving: Boolean = false;
    public suggestion = '';

    constructor(
        private forms: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private accountService: AccountService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Activation';
        this.activationForm = this.forms.group({
            activation: ['', [Validators.required, Validators.minLength(8)]],
            confirmation: ['', [Validators.required]],
            terms: [false, [Validators.requiredTrue]]
        }, { validator: this.passwordMatch });

        this.activationForm.get('activation').valueChanges.debounceTime(500).subscribe((password) => {
            if (this.activationForm.get('activation').invalid) {
                return;
            }

            this.accountService.validatePassword(password).then((validation) => {
                if (validation.score < 3) {
                    this.activationForm.get('activation').setErrors({ strength: true });
                    this.suggestion = validation.message;
                }
            });
        });
    }

    passwordMatch(control: AbstractControl) {
        const password = control.get('activation').value;
        const confirmation = control.get('confirmation').value;

        if (password !== confirmation) {
            control.get('confirmation').setErrors({ match: true });
        }
    }

    viewServiceAgreement() {
        this.dialog.open(ServiceTermsComponent, { width: '90%', maxWidth: '720px' });
    }

    activate(): void {
        this.saving = true;

        const activationData = this.activationForm.getRawValue();

        this.account = {
            _id: this.route.snapshot.params.account,
            password: activationData.activation,
            token: this.route.snapshot.queryParams.token,
            terms: activationData.terms
        };

        this.accountService
            .activateAccount(this.account)
            .then(() => this.snackbar.open('Account activated, please login', 'OK', { duration: 5000 }))
            .then(() => this.router.navigate(['/'], { replaceUrl: true }))
            .catch(() => this.snackbar.open('Activation failed, please try again', 'OK'))
            .then(() => this.saving = false);
    }
}
