import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guard.service';
import { PrivateComponent } from './private.component';
import { PublicComponent } from './public.component';

const routes: Routes = [
    {
        path: 'auth',
        component: PublicComponent,
        loadChildren: './modules/auth/auth.module#AuthModule'
    },
    {
        path: '',
        component: PrivateComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'account',
                loadChildren: './modules/account/account.module#AccountModule'
            },
            {
                path: 'orders',
                loadChildren: './modules/orders/orders.module#OrdersModule'
            },
            {
                path: 'products',
                loadChildren: './modules/products/products.module#ProductsModule'
            },
            {
                path: 'shipping',
                loadChildren: './modules/shipping/shipping.module#ShippingModule'
            }
        ]
    },
    {
        path: 'errors',
        component: PublicComponent,
        loadChildren: './modules/errors/errors.module#ErrorsModule'
    },
    {
        path: '',
        redirectTo: '/auth',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: '/errors/404'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ],
    exports: [
        RouterModule
    ],
    providers: [
        AuthGuard
    ]
})
export class VenzraRoutingModule {
}
