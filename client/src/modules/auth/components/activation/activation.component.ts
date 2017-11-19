import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { Activation, AccountService } from '../../../../services/account.service';
import { LayoutService } from '../../../../services/layout.service';

@Component({
    templateUrl: './activation.component.html',
    styleUrls: ['./activation.component.css']
})
export class ActivationComponent {

    account: Activation;
    activationForm: FormGroup;
    saving: Boolean = false;

    constructor(
        private forms: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private snackbar: MatSnackBar,
        private accountService: AccountService,
        private layout: LayoutService
    ) {
        this.layout.title = 'Activation';
        this.createForm();
    }

    createForm(): void {
        this.activationForm = this.forms.group({
            activation: ['', [Validators.required, Validators.minLength(8)]],
            confirmation: ['', [Validators.required]]
        }, {
            validator: this.passwordMatch
        });
    }

    passwordMatch(control: AbstractControl) {
        const password = control.get('activation').value;
        const confirmation = control.get('confirmation').value;

        if (password !== confirmation) {
            control.get('confirmation').setErrors({ match: true })
        }
    }

    activate(): void {
        this.saving = true;

        const activationData = this.activationForm.getRawValue();

        this.account = {
            _id: this.route.snapshot.params.account as string,
            password: activationData.activation as string,
            token: this.route.snapshot.queryParams.token as string
        };

        this.accountService
            .activateAccount(this.account)
            .then(() => this.snackbar.open('Account activated, please login', 'OK', { duration: 5000 }))
            .then(() => this.router.navigate(['/auth'], { replaceUrl: true }))
            .catch(() => this.snackbar.open('Activation failed, please try again', 'OK'))
            .then(() => this.saving = false);
    }
}
