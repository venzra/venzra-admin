import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VenzraCommonModule } from '../../common/common.module';
import { AccountRoutingModule } from './routing.module';

import { PricePipe } from '../../filters/price.pipe';

import { ProductCreateComponent } from './components/create/create.component';
import { ProductListComponent } from './components/list/list.component';
import { ProductViewComponent } from './components/view/view.component';

import { ProductListResolve, ProductRetrieveResolve, ProductService } from '../../services/product.service';

@NgModule({
    declarations: [
        PricePipe,
        ProductCreateComponent,
        ProductListComponent,
        ProductViewComponent
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
