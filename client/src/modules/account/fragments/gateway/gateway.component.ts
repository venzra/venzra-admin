import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from 'environment';
import { AccountService } from 'services';

import { Gateway } from '../../models/gateway';
import { Subscription } from '../../models/subscription';
import { GatewayService } from '../../services/gateway.service';

@Component({
    templateUrl: './gateway.component.html',
    providers: [GatewayService]
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
                    .then((subscription) => {
                        this.subscription = subscription;
                        this.gateway = subscription.gateway;
                    })
                    .then(() => this.router.navigate(['/account/gateway'], { replaceUrl: true }));
            }
        });

        this.accountService.getAccount().subscribe((account) => this.account = account);
    }
}
