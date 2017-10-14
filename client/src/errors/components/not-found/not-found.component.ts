import { Component } from '@angular/core';
import { LayoutService } from '../../../layout.service';

@Component({
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent {
    constructor(
        private layout: LayoutService
    ) {
        this.layout.title = 'Not Found';
    }
}
