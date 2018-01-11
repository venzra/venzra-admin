import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountService } from '../../../../services/account.service';
import { Subscription } from '../../../../services/subscription.service';
import { Gateway, GatewayService } from '../../../../services/gateway.service';

import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'payment-gateway',
    templateUrl: './gateway.component.html'
})
export class GatewayComponent implements OnInit {

    private account;
    public clientToken: string;
    public subscription: Subscription;
    public gateway: Gateway;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private accountService: AccountService,
        private gatewayService: GatewayService
    ) {
        this.clientToken = environment.stripeGateway;
    }

    ngOnInit(): void {
        this.route.data.subscribe((data: { subscription: Subscription }) => {
            this.subscription = data.subscription;
            this.gateway = data.subscription.gateway;
        });

        this.route.queryParams.subscribe((params: { code: string, scope: string, state: string }) => {
            if (params.code) {
                this.gatewayService
                    .createConnection(params.code)
                    .then(() => this.router.navigate(['/account/payments'], { replaceUrl: true }));
            }
        });

        this.accountService.getAccount().subscribe((account) => this.account = account);
    }
}
