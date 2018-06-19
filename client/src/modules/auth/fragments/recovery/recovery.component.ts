import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';

import 'rxjs/add/operator/debounceTime';

import { AccountService, Activation, LayoutService } from '@venzra/services';

@Component({
    templateUrl: './recovery.component.html',
    styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit {

    public account: Activation;
    public recoveryForm: FormGroup;
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
        this.layout.title = 'Recovery';

        this.recoveryForm = this.forms.group({
            activation: ['', [Validators.required, Validators.minLength(8)]],
            confirmation: ['', [Validators.required]]
        }, { validator: this.passwordMatch });

        this.recoveryForm.get('activation').valueChanges.debounceTime(500).subscribe((password) => {
            if (this.recoveryForm.get('activation').invalid) {
                return;
            }

            this.accountService.validatePassword(password).then((validation) => {
                if (validation.score < 3) {
                    this.recoveryForm.get('activation').setErrors({ strength: true });
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

    activate(): void {
        this.saving = true;

        const recoveryData = this.recoveryForm.getRawValue();

        this.account = {
            _id: this.route.snapshot.params.account,
            password: recoveryData.activation,
            token: this.route.snapshot.queryParams.token
        };

        this.accountService
            .activateAccount(this.account)
            .then(() => this.snackbar.open('Password reset successful, please login', 'OK', { duration: 5000 }))
            .then(() => this.router.navigate(['/'], { replaceUrl: true }))
            .catch(() => this.snackbar.open('Password reset failed, please try again', 'OK'))
            .then(() => this.saving = false);
    }
}
