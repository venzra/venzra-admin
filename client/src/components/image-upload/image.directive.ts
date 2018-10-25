import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

import { Account, VenzraImage } from '@venzra/models';
import { AccountService } from '@venzra/services';

import { environment } from '@venzra/environment';

@Directive({
    selector: '[venzraImage]'
})
export class VenzraImageDirective implements OnChanges {

    private account: Account;
    private cdnUrl = environment.cdnUri;

    @Input() public venzraImage: VenzraImage;

    constructor(
        protected element: ElementRef,
        private accountService: AccountService
    ) {
        this.account = this.accountService.getAccount().getValue();
    }

    ngOnChanges(): void {
        this.element.nativeElement.src = `${this.cdnUrl}/${this.venzraImage.path}`;
        this.element.nativeElement.alt = this.venzraImage.name;
    }

}
