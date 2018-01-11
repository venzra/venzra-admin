import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { ListModel } from '../../../../services/restful.service';
import { AccountService } from '../../../../services/account.service';
import { Subscription } from '../../../../services/subscription.service';
import { Plan } from '../../../../services/plan.service';
import { Payment, PaymentService } from '../../../../services/payment.service';
import { CalendarService } from '../../../../services/calendar.service';

@Component({
    selector: 'venzra-account-subscription',
    templateUrl: './subscription.component.html'
})
export class SubscriptionComponent implements OnInit {

    public saving = false;
    public subscription: Subscription;
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
        private paymentService: PaymentService,
        private calendarService: CalendarService
    ) {
        this.months = this.calendarService.getMonths();
        this.years = this.calendarService.generateYears(20, 20);
    }

    ngOnInit(): void {
        this.subscriptionForm = this.forms.group({
            plan: ['', [Validators.required]]
        });

        this.addressForm = this.forms.group({
            cardHolder: ['', [Validators.required]],
            email: [{ value: '', disabled: true }, []],
            street: ['', [Validators.required]],
            building: ['', []],
            city: ['', []],
            county: ['', [Validators.required]],
            postalCode: ['', [Validators.required]]
        });

        this.paymentForm = this.forms.group({
            cardNumber: ['', [Validators.required]],
            expiryMonth: ['', [Validators.required]],
            expiryYear: ['', [Validators.required]],
            cardVerificationCheck: ['', [Validators.required]]
        });

        this.route.data.subscribe((data: { subscription: Subscription, plans: ListModel<Plan> }) => {
            this.subscription = data.subscription;
            this.plans = data.plans.list;

            if (this.subscription.payment) {
                this.subscription.plan = this.plans.find((plan) => plan.reference === this.subscription.payment.package);
            }
        });

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

        const payment: Payment = {
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
                this.subscription.plan = this.plans.find((plan) => plan.reference === this.subscription.payment.package);
            })
            .catch((error) => this.snackbar.open(error.message || 'Subscription failed', 'OK', { duration: 5000 }))
            .then(() => this.saving = false);
    }
}
