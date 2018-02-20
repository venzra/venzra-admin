import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { AccountService, CalendarService } from '@venzra/services';

import { Card } from '../../models/card';
import { Plan } from '../../models/plan';
import { Subscription } from '../../models/subscription';

import { PaymentService } from '../../services/payment.service';

@Component({
    templateUrl: './subscription.component.html',
    providers: [CalendarService, PaymentService]
})
export class SubscriptionComponent implements OnInit {

    public saving = false;
    public subscription: Subscription;
    public plan: Plan;
    public plans: Array<Plan>;
    public subscriptionForm: FormGroup;
    public addressForm: FormGroup;
    public paymentForm: FormGroup;
    public months = [];
    public years = [];

    constructor(
        private route: ActivatedRoute,
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private accountService: AccountService,
        private calendarService: CalendarService,
        private paymentService: PaymentService
    ) {
        this.months = this.calendarService.getMonths();
        this.years = this.calendarService.generateYears(20, 20);
    }

    ngOnInit(): void {
        this.subscriptionForm = this.forms.group({
            plan: ['', [Validators.required]]
        });

        this.addressForm = this.forms.group({
            cardHolder: ['', [Validators.required, Validators.maxLength(80)]],
            email: [{ value: '', disabled: true }, []],
            street: ['', [Validators.required, Validators.maxLength(50)]],
            building: ['', [Validators.maxLength(50)]],
            city: ['', [Validators.maxLength(50)]],
            county: ['', [Validators.required, Validators.maxLength(50)]],
            postalCode: ['', [Validators.required, Validators.maxLength(12)]]
        });

        this.paymentForm = this.forms.group({
            cardNumber: ['', [Validators.required]],
            expiryMonth: ['', [Validators.required]],
            expiryYear: ['', [Validators.required]],
            cardVerificationCheck: ['', [Validators.required]]
        });

        this.subscription = this.route.snapshot.data.subscription;
        this.plans = this.route.snapshot.data.plans.list;

        if (this.subscription.payment) {
            this.plan = this.plans.find((plan) => plan.reference === this.subscription.payment.package);
        }

        this.accountService.getAccount().subscribe((account) => this.addressForm.get('email').setValue(account.identity));
    }

    selectPlan(plan) {
        this.subscriptionForm.get('plan').setValue(plan);
    }

    createSubscription() {
        this.saving = true;

        const subscriptionData = this.subscriptionForm.getRawValue();
        const addressData = this.addressForm.getRawValue();
        const paymentData = this.paymentForm.getRawValue();

        const payment: Card = {
            cardHolder: addressData.cardHolder,
            cardNumber: paymentData.cardNumber,
            expiryMonth: paymentData.expiryMonth,
            expiryYear: paymentData.expiryYear,
            cardVerificationCheck: paymentData.cardVerificationCheck,
            building: addressData.building,
            street: addressData.street,
            city: addressData.city,
            county: addressData.county,
            postalCode: addressData.postalCode
        };

        this.paymentService
            .createSubscription(addressData.email, subscriptionData.plan, payment)
            .then((subscription) => {
                this.subscription = subscription;
                this.plan = this.plans.find((plan) => plan.reference === this.subscription.payment.package);
            })
            .catch((error) => this.snackbar.open(error.message || 'Subscription failed', 'OK', { duration: 5000 }))
            .then(() => this.saving = false);
    }
}
