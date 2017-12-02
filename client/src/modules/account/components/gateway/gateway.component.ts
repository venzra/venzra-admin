import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { AccountService } from '../../../../services/account.service';
import { Subscription } from '../../../../services/subscription.service';
import { BankAccount, Gateway, GatewayService } from '../../../../services/gateway.service';
import { CalendarService } from '../../../../services/calendar.service';

@Component({
    selector: 'payment-gateway',
    templateUrl: './gateway.component.html'
})
export class GatewayComponent implements OnInit {

    public saving = false;
    public subscription: Subscription;
    public gateway: Gateway;
    public legalForm: FormGroup;
    public addressForm: FormGroup;
    public gatewayForm: FormGroup;
    public months = [];
    public years = [];

    constructor(
        private route: ActivatedRoute,
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private accountService: AccountService,
        private gatewayService: GatewayService,
        private calendarService: CalendarService
    ) {
        this.months = this.calendarService.getMonths();
        this.years = this.calendarService.generateYears(80, -16);
    }

    ngOnInit(): void {
        this.legalForm = this.forms.group({
            forename: ['', [Validators.required]],
            surname: ['', [Validators.required]],
            email: ['', [Validators.required]],
            day: ['', [Validators.required]],
            month: ['', [Validators.required]],
            year: ['', [Validators.required]]
        });

        this.addressForm = this.forms.group({
            company: ['', [Validators.required]],
            street: ['', [Validators.required]],
            building: ['', []],
            city: ['', []],
            county: ['', [Validators.required]],
            postalCode: ['', [Validators.required]]
        });

        this.gatewayForm = this.forms.group({
            holder: ['', [Validators.required]],
            number: ['', [Validators.required]],
            sortCode: ['', [Validators.required]]
        });

        this.route.data.subscribe((data: { subscription: Subscription }) => {
            this.subscription = data.subscription;
            this.gateway = data.subscription.gateway;
        });

        this.accountService.getAccount().subscribe((account) => this.legalForm.get('email').setValue(account.identity));
    }

    allocateGateway() {
        this.saving = true;

        const legalData = this.legalForm.getRawValue();
        const addressData = this.addressForm.getRawValue();
        const gatewayData = this.gatewayForm.getRawValue();

        const legalEntity = {
            forename: legalData.forename as string,
            surname: legalData.surname as string,
            company: addressData.company as string,
            email: legalData.email as string,
            legal: {
                street: addressData.street as string,
                building: addressData.building as string,
                city: addressData.city as string,
                county: addressData.county as string,
                postalCode: addressData.postalCode as string
            },
            dob: {
                day: legalData.day as number,
                month: legalData.month as number,
                year: legalData.year as number
            }
        };

        const bankAccount: BankAccount = {
            holder: gatewayData.holder as string,
            number: gatewayData.number as number,
            sortCode: gatewayData.sortCode as string
        };

        this.gatewayService
            .createConnection(legalEntity, bankAccount)
            .then((subscription) => this.subscription = subscription)
            .catch((error) => this.snackbar.open(error.message || 'Creation failed', 'OK', { duration: 5000 }))
            .then(() => this.saving = false);
    }
}
