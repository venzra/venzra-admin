import { Injectable, NgModule } from '@angular/core';
import { ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy } from '@angular/router';

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {

    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }

    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    }

    shouldAttach(route: ActivatedRouteSnapshot): boolean {
        return false;
    }

    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        return null;
    }

    shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        return curr.routeConfig === null && future.routeConfig === null;
    }

}

@NgModule({
    providers: [
        {
            provide: RouteReuseStrategy,
            useClass: CustomRouteReuseStrategy
        }
    ]
})
export class RouteReuseModule {
}
