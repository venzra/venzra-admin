import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Subscription } from '../../models/subscription';

@Component({
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

    public subscription: Subscription;

    constructor(
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.subscription = this.route.snapshot.data.subscription;
    }

}
