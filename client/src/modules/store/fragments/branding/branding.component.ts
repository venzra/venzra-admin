import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatChipInputEvent, MatSnackBar } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { LayoutService } from '@venzra/services';

import { Subscription } from '../../models/subscription';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
    templateUrl: './branding.component.html',
    providers: [SubscriptionService]
})
export class BrandingComponent implements OnInit {

    public subscription: Subscription;
    public settingsForm: FormGroup;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    public colorOptions = [
        { name: 'Amber', value: 'amber' },
        { name: 'Blue', value: 'blue' },
        { name: 'Steel', value: 'blue-grey' },
        { name: 'Brown', value: 'brown' },
        { name: 'Cyan', value: 'cyan' },
        { name: 'Deep Orange', value: 'deep-orange' },
        { name: 'Deep Purple', value: 'deep-purple' },
        { name: 'Green', value: 'green' },
        { name: 'Grey', value: 'grey' },
        { name: 'Indigo (default)', value: 'indigo' },
        { name: 'Light Blue', value: 'light-blue' },
        { name: 'Light Green', value: 'light-green' },
        { name: 'Lime', value: 'lime' },
        { name: 'Orange', value: 'orange' },
        { name: 'Pink', value: 'pink' },
        { name: 'Purple', value: 'purple' },
        { name: 'Teal', value: 'teal' },
        { name: 'Yellow', value: 'yellow' }
    ];

    constructor(
        private route: ActivatedRoute,
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private subscriptionService: SubscriptionService,
        private layout: LayoutService
    ) {
    }

    ngOnInit(): void {
        this.layout.title = 'Settings';
        this.subscription = this.route.snapshot.data.subscription;

        this.loadTheme();

        this.settingsForm = this.forms.group({
            storeName: [this.subscription.storeName, [Validators.required, Validators.minLength(3), Validators.maxLength(40)]],
            domain: [{ value: this.getDomain(this.subscription.storeName), disabled: true }, []],
            additionalDomains: [this.subscription.additionalDomains.pop(), [Validators.pattern(/^(!http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/)]],
            strapline: [this.subscription.strapline, [Validators.maxLength(120)]],
            icon: [this.subscription.icon, []],
            logo: [this.subscription.logo, []],
            theme: this.forms.group({
                color: [this.subscription.theme.color, []]
            })
        });

        this.settingsForm.get('storeName').valueChanges.subscribe((value) => this.settingsForm.get('domain').reset(this.getDomain(value)));
    }

    loadTheme(): void {
        if (!this.subscription.theme) {
            this.subscription.theme = { color: 'indigo' };
        } else if (!this.subscription.theme.color) {
            this.subscription.theme.color = 'indigo';
        }
    }

    getDomain(subDomain: string): string {
        return `https://${subDomain.replace(/[^a-z|0-9\-\s]/gi, ' ').trim().replace(/\s+/g, '-').toLowerCase()}.venzra.io`;
    }

    addDomain(event: MatChipInputEvent): void {
        const input = event.input;
        const value = (event.value || '').trim();
        const domains = this.settingsForm.get('additionalDomains').value;

        console.log(value.trim());
        if (value) {
            domains.push(value.trim());
        }

        if (input) {
            input.value = '';
        }

        this.settingsForm.get('additionalDomains').setValue(domains);
    }

    removeDomain(index: number): void {
        const domains = this.settingsForm.get('additionalDomains').value;

        if (index >= 0) {
            domains.splice(index, 1);
        }

        this.settingsForm.get('additionalDomains').setValue(domains);
    }

    updateSettings() {
        console.log(this.settingsForm.controls);

        this.subscriptionService
            .updateSettings(this.settingsForm.controls)
            .then((subscription) => this.subscription = subscription)
            .then(() => this.loadTheme())
            .then(() => this.settingsForm.reset(this.subscription))
            .then(() => this.settingsForm.get('domain').reset(this.getDomain(this.subscription.storeName)))
            .then(() => this.settingsForm.markAsPristine())
            .catch((error: HttpErrorResponse) => {
                error = JSON.parse(error.error);
                this.snackbar.open(error.message || 'Update failed', 'OK', { duration: 5000 });
            });
    }
}
