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
        path: 'account',
        component: PrivateComponent,
        loadChildren: './modules/account/account.module#AccountModule',
        canActivateChild: [AuthGuard]
    },
    {
        path: 'products',
        component: PrivateComponent,
        loadChildren: './modules/products/products.module#ProductsModule',
        canActivateChild: [AuthGuard]
    },
    {
        path: 'orders',
        component: PrivateComponent,
        loadChildren: './modules/orders/orders.module#OrdersModule',
        canActivateChild: [AuthGuard]
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
