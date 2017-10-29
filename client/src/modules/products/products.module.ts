import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VenzraCommonModule } from '../../common/common.module';
import { AccountRoutingModule } from './routing.module';

import { ProductListComponent } from './components/list/list.component';
import { ProductCreateComponent } from './components/create/create.component';

import { ProductListResolve, ProductRetrieveResolve, ProductService } from '../../services/product.service';

@NgModule({
    declarations: [
        ProductListComponent,
        ProductCreateComponent
    ],
    imports: [
        CommonModule,
        VenzraCommonModule,
        AccountRoutingModule
    ],
    providers: [
        ProductService,
        ProductListResolve,
        ProductRetrieveResolve
    ]
})
export class ProductsModule {
}
