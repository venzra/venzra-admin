import { Injectable, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import 'rxjs/add/operator/do';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor(
        private router: Router
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).do(null, (err) => {
            if (err instanceof HttpErrorResponse) {
                switch (err.status) {
                    case 401:
                        this.router.navigate(['/auth/logout']);
                        break;
                }
            }
        });
    }
}

@NgModule({
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ErrorInterceptor,
            multi: true
        }
    ]
})
export class ErrorInterceptorModule {
}
