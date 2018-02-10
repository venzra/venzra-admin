import { NgModule } from '@angular/core';
import { PageHeaderComponent } from './page-header/page-header.component';
import { PageContentComponent } from './page-content/page-content.component';

@NgModule({
    declarations: [
        PageHeaderComponent,
        PageContentComponent
    ],
    exports: [
        PageHeaderComponent,
        PageContentComponent
    ]
})
export class PageModule {
}
