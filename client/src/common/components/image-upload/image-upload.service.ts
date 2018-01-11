import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export class Image {
    _id?: string;
}

@Injectable()
export class ImageService {

    public progress: BehaviorSubject<number> = new BehaviorSubject(0);
    public image: BehaviorSubject<Image> = new BehaviorSubject(null);

    constructor(
        private http: HttpClient
    ) {}

    create(image): void {
        const reportProgress = true;
        const req = new HttpRequest('POST', '/api/images', image, { reportProgress });

        this.http.request(req)
            .subscribe((event: any) => {
                if (event.type === HttpEventType.UploadProgress) {
                    this.image.next(null);
                    this.progress.next(Math.round(100 * (event.loaded / event.total)))
                } else if (event instanceof HttpResponse) {
                    this.image.next(event.body);
                }
            });
    }

}
