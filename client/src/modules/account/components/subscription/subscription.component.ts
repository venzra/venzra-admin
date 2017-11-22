import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
        private accountService: AccountService
    ) { }

    ngOnInit(): void {
        this.route.data.subscribe((data: { subscription: Subscription }) => this.subscription = data.subscription);

        this.accountService.getAccount().subscribe((account) => console.log(account));
    }
}
