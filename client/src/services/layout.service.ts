import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable()
export class LayoutService {

    private _title: string;

    constructor(
        private pageTitle: Title
    ) {}

    set title(title: string) {
        this._title = title;
        this.pageTitle.setTitle(`${title} | Venzra`);
    }

    get title() {
        return this._title;
    }
}
