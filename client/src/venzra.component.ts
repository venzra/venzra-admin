import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-venzra',
    template: '<router-outlet></router-outlet>'
})
export class VenzraComponent implements OnInit {

    constructor(
        private router: Router
    ) { }

    ngOnInit(): void {
        if (localStorage.getItem('authenticated')) {
            this.router.navigate(['/account'], { replaceUrl: true })
        }
    }
}
