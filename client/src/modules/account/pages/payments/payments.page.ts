import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Subscription } from '../../../../services/subscription.service';
import { LayoutService } from '../../../../services/layout.service';

@Component({
    templateUrl: './payments.page.html'
})
export class PaymentPageComponent implements OnInit {

    subscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Manage payents';

        this.route.data.subscribe((data: { subscription: Subscription }) => {
            this.subscription = data.subscription;
        });
    }
}
