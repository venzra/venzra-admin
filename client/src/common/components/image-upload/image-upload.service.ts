import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEventType, HttpHeaders, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';

import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Image {
    _id?: string;
}

@Injectable()
export class ImageService {

    public progress: BehaviorSubject<number> = new BehaviorSubject(0);
    public image: Subject<Image> = new Subject();
    public result: Subject<{ status: Number, text: String }> = new Subject();

    constructor(
        private http: HttpClient
    ) {}

    create(image, meta): void {
        const reportProgress = true;

        let headers = new HttpHeaders();
        headers = headers.set('Content-Type', meta.type);

        const params = Object.keys(meta).filter((key) => key !== 'type').reduce((query, key) => query.set(key, meta[key]), new HttpParams());

        const req = new HttpRequest('POST', '/api/images', image, { headers, params, reportProgress });

        this.http.request(req)
            .subscribe((event: any) => {
                if (event.type === HttpEventType.ResponseHeader && event.status !== 200) {
                    this.result.next({ status: event.status, text: event.statusText });
                } else if (event.type === HttpEventType.UploadProgress) {
                    this.image.next(null);
                    this.progress.next(Math.round(100 * (event.loaded / event.total)))
                } else if (event instanceof HttpResponse) {
                    this.image.next(event.body);
                }
            });
    }

}
