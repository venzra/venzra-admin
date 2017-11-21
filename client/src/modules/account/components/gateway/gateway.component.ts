import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { AccountService } from '../../../../services/account.service';
import { Subscription } from '../../../../services/subscription.service';
import { BankAccount, GatewayService } from '../../../../services/gateway.service';

@Component({
    selector: 'payment-gateway',
    templateUrl: './gateway.component.html'
})
export class GatewayComponent implements OnInit {

    public saving = false;
    public subscription: Subscription;
    public gatewayForm: FormGroup;

    constructor(
        private route: ActivatedRoute,
        private forms: FormBuilder,
        private snackbar: MatSnackBar,
        private accountService: AccountService,
        private gatewayService: GatewayService
    ) { }

    ngOnInit(): void {
        this.gatewayForm = this.forms.group({
            holder: ['', [Validators.required]],
            email: [{ value: '', disabled: true }, []],
            number: ['', [Validators.required]],
            sortCode: ['', [Validators.required]],
            acceptTerms: ['', [Validators.required]]
        });

        this.route.data.subscribe((data: { subscription: Subscription }) => this.subscription = data.subscription);

        this.accountService.getAccount().subscribe((account) => this.gatewayForm.get('email').setValue(account.identity));
    }

    allocateGateway() {
        this.saving = true;

        const gatewayData = this.gatewayForm.getRawValue();

        const gateway = {
            email: gatewayData.email as string,
            terms: gatewayData.acceptTerms as boolean
        };

        const bankAccount: BankAccount = {
            holder: gatewayData.holder as string,
            number: gatewayData.number as number,
            sortCode: gatewayData.sortCode as string
        };

        this.gatewayService
            .createConnection(gateway, bankAccount)
            .then((subscription) => this.subscription = subscription)
            .catch((error) => this.snackbar.open(error.message || 'Creation failed', 'OK', { duration: 5000 }))
            .then(() => this.saving = false);
    }
}
