import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Subscription } from '../../../../services/subscription.service';
import { LayoutService } from '../../../../services/layout.service';

@Component({
    templateUrl: './setup.page.html'
})
export class SetupPage implements OnInit {

    subscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Setup';

        this.route.data.subscribe((data: { subscription: Subscription }) => {
            this.subscription = data.subscription;
        });
    }
}
