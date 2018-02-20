import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { LayoutService } from '@venzra/services';

import { Subscription } from '../../models/subscription';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
    templateUrl: './branding.component.html',
    providers: [SubscriptionService]
})
export class BrandingComponent implements OnInit {

    subscription: Subscription;
    settingsForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private subscriptionService: SubscriptionService,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Settings';

        this.settingsForm = this.forms.group({
            storeName: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
            strapline: ['', [Validators.maxLength(120)]],
            icon: ['', []],
            logo: ['', []]
        });

        this.route.data.subscribe((data: { subscription: Subscription }) => {
            this.subscription = data.subscription;
            this.settingsForm.reset(this.subscription);
        });
    }

    getDomain(): string {
        const settings = this.settingsForm.getRawValue();
        const storeName = settings.storeName as string;

        return `https://${storeName.replace(/[^a-z|0-9\-\s]/gi, ' ').trim().replace(/\s+/g, '-').toLowerCase()}.venzra.io`;
    }

    updateSettings() {
        this.subscriptionService
            .updateSettings(this.settingsForm.controls)
            .then((subscription) => this.settingsForm.reset(subscription))
            .then(() => this.settingsForm.markAsPristine())
            .catch((error: HttpErrorResponse) => {
                error = JSON.parse(error.error);
                this.snackbar.open(error.message || 'Update failed', 'OK', { duration: 5000 });
            });
    }
}
