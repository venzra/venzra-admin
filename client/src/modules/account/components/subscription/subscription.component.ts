import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';

import { Account, AuthenticationService } from '../../../../services/authentication.service';
import { Subscription, BankAccount, SubscriptionService } from '../../../../services/subscription.service';
import { LayoutService } from '../../../../services/layout.service';

@Component({
    templateUrl: './service-terms.dialog.html'
})
export class ServiceTermsDialog {
    constructor(
        private dialogRef: MatDialogRef<ServiceTermsDialog>
    ) { }

    confirm(): void {
        this.dialogRef.close();
    }
}

@Component({
    selector: 'app-subscription',
    templateUrl: './subscription.component.html'
})
export class SubscriptionComponent implements OnInit {

    public saving = false;

    public account: Account;
    public subscription: Subscription;
    public subscriptionForm: FormGroup;

    constructor(
        private forms: FormBuilder,
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private authenticationService: AuthenticationService,
        private subscriptionService: SubscriptionService,
        private layout: LayoutService
    ) {
        this.account = authenticationService.userAccount;
    }

    ngOnInit(): void {
        this.layout.title = 'Subscription';

        this.subscriptionForm = this.forms.group({
            holder: ['', [Validators.required]],
            email: [{ value: this.account.identity, disabled: true }, []],
            number: ['', [Validators.required]],
            sortCode: ['', [Validators.required]],
            acceptTerms: ['', [Validators.required]]
        });
    }

    viewServiceAgreement() {
        this.dialog.open(ServiceTermsDialog, { width: '640px' })
    }

    createSubscription() {
        this.saving = true;

        const subscriptionData = this.subscriptionForm.getRawValue();

        const subscription = {
            email: subscriptionData.email as string,
            terms: subscriptionData.acceptTerms as boolean
        };

        const bankAccount: BankAccount = {
            holder: subscriptionData.holder as string,
            number: subscriptionData.number as number,
            sortCode: subscriptionData.sortCode as string
        };

        this.subscriptionService
            .createSubscription(subscription, bankAccount)
            .then((subscription) => this.subscriptionForm.reset(subscription))
            .then(() => this.subscriptionForm.markAsPristine())
            .catch((error) => this.snackbar.open(error.message || 'Creation failed', 'OK', { duration: 5000 }))
            .then(() => this.saving = false);
    }
}
