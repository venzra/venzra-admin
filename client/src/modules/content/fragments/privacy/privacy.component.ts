import { Component, OnInit } from '@angular/core';

import { defaultTerms } from './default';

@Component({
    templateUrl: './privacy.component.html'
})
export class ContentPrivacyComponent implements OnInit {

    public policy: string;

    constructor(
    ) { }

    ngOnInit(): void {
        this.policy = defaultTerms;
    }
}
