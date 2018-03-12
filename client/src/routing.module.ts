import { NgModule } from '@angular/core';

import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './services/guard.service';
import { PrivateComponent } from './site/private/private.component';
import { PublicComponent } from './site/public/public.component';

const routes: Routes = [
    {
        path: '',
        component: PublicComponent,
        loadChildren: './modules/auth/auth.module#AuthModule'
    },
    {
        path: '',
        component: PrivateComponent,
        canActivateChild: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                loadChildren: './modules/dashboard/dashboard.module#DashboardModule'
            },
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
                path: 'categories',
                loadChildren: './modules/categories/categories.module#CategoryModule'
            },
            {
                path: 'shipping',
                loadChildren: './modules/shipping/shipping.module#ShippingModule'
            },
            {
                path: 'store',
                loadChildren: './modules/store/store.module#StoreModule'
            }
        ]
    },
    {
        path: 'errors',
        component: PublicComponent,
        loadChildren: './modules/errors/errors.module#ErrorsModule'
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
