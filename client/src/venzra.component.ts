import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-venzra',
    template: '<router-outlet></router-outlet>'
})
export class VenzraComponent {

    constructor(
        private router: Router
    ) { }
}
