import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatSnackBar } from '@angular/material';

import { Authentication, AuthenticationService } from '../../../../services/authentication.service';
import { LayoutService } from '../../../../services/layout.service';

const EMAIL_REGEX = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {

    account: Authentication;
    accountForm: FormGroup;
    saving: Boolean = false;

    constructor(
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private authenticationService: AuthenticationService,
        private layout: LayoutService
    ) {
        this.layout.title = 'Login';
        this.createForm();
    }

    createForm(): void {
        this.accountForm = this.forms.group({
            emailAddress: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
            password: ['', [Validators.required]]
        });
    }

    login(): void {
        this.saving = true;

        const accountData = this.accountForm.getRawValue();

        this.account = {
            identity: accountData.emailAddress as string,
            password: accountData.password as string
        };

        this.authenticationService
            .performLogin(this.account)
            .catch(() => this.snackbar.open('Login failed, please try again', 'OK', { duration: 5000 }))
            .then(() => this.saving = false);
    }
}
