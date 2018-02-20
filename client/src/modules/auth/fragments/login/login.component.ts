import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { AccountCredentials, AccountService, LayoutService } from '@venzra/services';

const EMAIL_REGEX = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {

    credentials: AccountCredentials;
    authenticationForm: FormGroup;
    saving: Boolean = false;

    constructor(
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private accountService: AccountService,
        private layout: LayoutService
    ) {
        this.layout.title = 'Login';
        this.createForm();
    }

    createForm(): void {
        this.authenticationForm = this.forms.group({
            emailAddress: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]],
            password: ['', [Validators.required]]
        });
    }

    login(): void {
        this.saving = true;

        const credentialData = this.authenticationForm.getRawValue();

        this.credentials = {
            identity: credentialData.emailAddress as string,
            password: credentialData.password as string
        };

        this.accountService
            .performLogin(this.credentials)
            .catch(() => this.snackbar.open('Login failed, please try again', 'OK', { duration: 5000 }))
            .then(() => this.saving = false);
    }
}
