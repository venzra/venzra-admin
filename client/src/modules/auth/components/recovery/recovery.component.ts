import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { Recovery, AccountService } from '../../../../services/account.service';
import { LayoutService } from '../../../../services/layout.service';

const EMAIL_REGEX = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;

@Component({
    templateUrl: './recovery.component.html',
    styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent {

    account: Recovery;
    recoveryForm: FormGroup;
    saving: Boolean = false;

    constructor(
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private accountService: AccountService,
        private layout: LayoutService
    ) {
        this.layout.title = 'Recovery';
        this.createForm();
    }

    createForm(): void {
        this.recoveryForm = this.forms.group({
            emailAddress: ['', [Validators.required, Validators.pattern(EMAIL_REGEX)]]
        });
    }

    recover(): void {
        this.saving = true;

        const recoveryData = this.recoveryForm.getRawValue();

        this.account = {
            identity: recoveryData.emailAddress as string
        };

        this.accountService
            .performRecovery(this.account)
            .catch(() => this.snackbar.open('Recovery failed, please try again', 'OK'))
            .then(() => this.saving = false);
    }
}
