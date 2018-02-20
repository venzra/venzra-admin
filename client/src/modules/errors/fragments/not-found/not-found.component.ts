import { Component, OnInit } from '@angular/core';

import { LayoutService } from '@venzra/services';

@Component({
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {

    constructor(
        private layout: LayoutService
    ) { }

    ngOnInit(): void {
        this.layout.title = 'Not Found';
    }

}
