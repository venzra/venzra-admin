import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material';

import { ServiceTermsComponent } from '../service-terms/service-terms.component';

import { AccountService } from '../../../../services/account.service';
import { Subscription } from '../../../../services/subscription.service';

@Component({
    selector: 'account-subscription',
    templateUrl: './subscription.component.html'
})
export class SubscriptionComponent implements OnInit {

    public subscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private accountService: AccountService,
        private dialog: MatDialog
    ) { }

    ngOnInit(): void {
        this.route.data.subscribe((data: { subscription: Subscription }) => this.subscription = data.subscription);

        this.accountService.getAccount().subscribe((account) => console.log(account));
    }

    viewServiceAgreement() {
        this.dialog.open(ServiceTermsComponent, { width: '640px' });
    }
}
