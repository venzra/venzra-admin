import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { Subscription } from '../../../../services/subscription.service';
import { LayoutService } from '../../../../services/layout.service';

@Component({
    templateUrl: './store.page.html'
})
export class StorePage implements OnInit {

    subscription: Subscription;

    constructor(
        private route: ActivatedRoute,
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Store configuration';

        this.route.data.subscribe((data: { subscription: Subscription }) => {
            this.subscription = data.subscription;
        });
    }
}
