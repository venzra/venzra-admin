import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { AccountService, LayoutService, Recovery } from '@venzra/services';

const EMAIL_REGEX = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

@Component({
    templateUrl: './forgotten.component.html',
    styleUrls: ['./forgotten.component.scss']
})
export class ForgottenComponent {

    account: Recovery;
    recoveryForm: FormGroup;
    saving: Boolean = false;

    constructor(
        private forms: FormBuilder,
        private router: Router,
        private snackbar: MatSnackBar,
        private accountService: AccountService,
        private layout: LayoutService
    ) {
        this.layout.title = 'Forgotten password';
        this.createForm();
    }

    createForm(): void {
        this.recoveryForm = this.forms.group({
            identity: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]]
        });
    }

    recover(): void {
        const recoveryData = this.recoveryForm.getRawValue();

        this.saving = true;

        this.accountService
            .performRecovery(recoveryData)
            .then(() => this.router.navigate(['/forgotten-confirmation']))
            .catch(() => this.snackbar.open('Recovery failed, please try again', 'OK'))
            .then(() => this.saving = false);
    }
}
