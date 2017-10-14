import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subscription } from '../../models/subscription';
import { SubscriptionService } from '../../services/subscription.service';
import { LayoutService } from '../../../layout.service';

@Component({
    selector: 'app-subscription',
    templateUrl: './subscription.component.html'
})
export class SubscriptionComponent implements OnInit {

    subscription: Subscription;
    subscriptionForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private subscriptionService: SubscriptionService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Account';

        this.subscriptionForm = this.forms.group({
            storeName: ['', [Validators.required, Validators.minLength(5)]],
            strapline: ['', []]
        });

        this.route.data.subscribe((data: { subscription: Subscription }) => {
            this.subscription = data.subscription;
            this.subscriptionForm.reset(this.subscription);
        });
    }

    getDomain(): string {
        const subscription = this.subscriptionForm.value;
        const storeName = subscription.storeName as string;

        return `https://${storeName.replace(/[^a-z|0-9\-\s]/gi, ' ').trim().replace(/\s+/g, '-').toLowerCase()}.venzra.io`;
    }

    updateSubscription() {
        const subscriptionData = this.subscriptionForm.value;

        const updates = {
            storeName: subscriptionData.storeName as string,
            strapline: subscriptionData.strapline as string
        };

        this.subscriptionService
            .createSubscription(updates)
            .then((subscription) => this.subscriptionForm.reset(subscription))
            .then(() => this.subscriptionForm.markAsPristine())
            .catch((error) => this.snackbar.open(error.message || 'Update failed', 'OK', { duration: 5000 }));
    }
}
