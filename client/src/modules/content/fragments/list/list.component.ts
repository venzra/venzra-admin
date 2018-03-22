import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from '../../models/subscription';

@Component({
    templateUrl: './list.component.html'
})
export class ContentListComponent implements OnInit {

    public subscription: Subscription;

    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.subscription = this.route.snapshot.data.subscription;
    }

    hasAddon(name) {
        return !!this.subscription.addons.find((addon) => addon.name === name);
    }

}
