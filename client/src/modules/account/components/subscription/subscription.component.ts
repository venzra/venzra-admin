import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { Subscription, BankAccount, SubscriptionService } from '../../../../services/subscription.service';
import { LayoutService } from '../../../../services/layout.service';

@Component({
    selector: 'app-subscription',
    templateUrl: './subscription.component.html'
})
export class SubscriptionComponent implements OnInit {

    subscription: Subscription;
    subscriptionForm: FormGroup;

    constructor(
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private subscriptionService: SubscriptionService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Subscription';

        this.subscriptionForm = this.forms.group({
            holder: ['', [Validators.required]],
            email: [{ value: 'andrew@sysen.co.uk', disabled: true }, []],
            number: ['', [Validators.required]],
            sortCode: ['', [Validators.required]]
        });
    }

    createSubscription() {
        const subscriptionData = this.subscriptionForm.getRawValue();

        const subscription = {
            email: subscriptionData.email as string
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
            .catch((error) => this.snackbar.open(error.message || 'Update failed', 'OK', { duration: 5000 }));
    }
}
