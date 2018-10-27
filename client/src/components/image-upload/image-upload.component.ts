import { AfterContentInit, Component, ContentChild, ElementRef, HostListener, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { VenzraImage } from '@venzra/models';

import { ImageInputControl } from './image-input.control';
import { ImageService } from './image-upload.service';

import { environment } from '@venzra/environment';

@Component({
    selector: 'venzra-image-upload',
    exportAs: 'venzraImageUpload',
    templateUrl: 'image-upload.component.html',
    styleUrls: ['image-upload.component.scss'],
    providers: [ImageService]
})
export class ImageUploadComponent implements AfterContentInit {

    public name = 'media';
    public touched = false;
    public state: 'info' | 'success' | 'error' = 'info';
    public detail: any;
    public image: VenzraImage;
    public mode: string;
    public progress: number;
    public background: any;

    @Input() target = '';

    @Input() usage = '';

    @ContentChild(ImageInputControl) control: ImageInputControl;

    constructor(
        protected element: ElementRef,
        private sanitizer: DomSanitizer,
        private imageService: ImageService
    ) {
        this.imageService.result.subscribe(({ status, text }) => {
            if (status !== 200) {
                this.image = null;
                this.background = null;
                this.progress = 0;
                this.state = 'error';
                this.detail = `${status}: ${text}`;
            }
        });

        this.imageService.progress.subscribe((progress) => {
            this.mode = 'determinate';
            this.progress = progress;

            if (this.progress === 100) {
                this.mode = 'buffer';
                this.progress = 0;
            }
        });

        this.imageService.image.subscribe((image: VenzraImage) => {
            if (image) {
                this.setValue(image);
                this.showImage(image);
            } else {
                this.showImage(null);
            }
        });
    }

    ngAfterContentInit(): void {
        this.name = this.control.ngControl.name;
        const value = this.control.ngControl.value;

        if (value) {
            this.showImage(value);
        }
    }

    showImage(image: VenzraImage) {
        if (image) {
            this.image = image;
            this.background = this.sanitizer.bypassSecurityTrustStyle(`url(${environment.cdnUri}/${image.path})`);
        } else {
            this.image = null;
            this.background = null;
        }
        this.state = 'success';
    }

    setValue(value: VenzraImage) {
        this.control.ngControl.reset(value);

        if (value) {
            this.control.ngControl.control.markAsDirty();
            this.control.ngControl.control.markAsTouched();
            this.control.ngControl.control.updateValueAndValidity();
        }
    }

    getMeta() {
        switch (this.usage) {
            case 'feature':
                return { width: 1024, height: 500, mode: 'crop', type: 'image/jpeg' };
            case 'promotion':
                return { width: 512, height: 512, mode: 'crop', type: 'image/jpeg' };
            case 'icon':
                return { width: 180, height: 180, mode: 'crop', type: 'image/png' };
            case 'logo':
                return { width: 400, height: 100, mode: 'ratio', type: 'image/png' };
        }
    }

    formatRequirements() {
        const meta = this.getMeta();

        return [
            meta.mode === 'crop' ? `${meta.width} * ${meta.height}px` : `${meta.width}px wide or ${meta.height}px high`
        ];
    }

    validate(data): File | boolean {
        const validTypes = ['image/png', 'image/jpg', 'image/jpeg'];
        const file = data ? data.files[0] : null;
        if (file) {
            if (!validTypes.includes(file.type)) {
                this.detail = file.type;
                return false;
            }
        }
        return file || true;
    }

    scaleDown(image: HTMLCanvasElement | HTMLImageElement, width: number, height: number): HTMLCanvasElement {
        let reductionRate = 0.5;

        while (image.width / 2 > width && image.height / 2 > height) {
            image = this.reduceSize(image, reductionRate);
        }

        reductionRate = image.width > image.height ? height / image.height : width / image.width;
        image = this.reduceSize(image, reductionRate);

        return <HTMLCanvasElement>image;
    }

    reduceSize(image: HTMLCanvasElement | HTMLImageElement, reduction = 0.5): HTMLCanvasElement {
        const canvas = <HTMLCanvasElement>document.createElement('canvas');
        const context: CanvasRenderingContext2D = canvas.getContext('2d');

        canvas.width = (image.width * reduction);
        canvas.height = (image.height * reduction);
        context.scale(reduction, reduction);
        context.drawImage(image, 0, 0);

        return canvas;
    }

    resizeOnCanvas(imageSrc: string, targetWidth: number, targetHeight: number): Promise<HTMLCanvasElement> {
        const image = new Image();
        const canvas = <HTMLCanvasElement>document.createElement('canvas');
        const context: CanvasRenderingContext2D = canvas.getContext('2d');

        return new Promise<HTMLCanvasElement>((resolve) => {
            image.onload = () => {
                const imageCanvas = this.scaleDown(image, targetWidth, targetHeight);
                canvas.width = imageCanvas.width;
                canvas.height = imageCanvas.height;
                context.drawImage(imageCanvas, 0, 0);
                resolve(canvas);
            };

            image.src = imageSrc;
        });
    }

    @HostListener('dragenter', ['$event'])
    @HostListener('dragover', ['$event'])
    onDragOver(event: any) {
        event.preventDefault();
        this.touched = false;
        const isValid = this.validate(event.dataTransfer);
        this.element.nativeElement.classList.add(isValid ? 'active' : 'warning');
    }

    @HostListener('mouseleave')
    @HostListener('dragleave')
    onDragLeave() {
        this.touched = true;
        this.element.nativeElement.classList.remove('active', 'warning');
    }

    @HostListener('drop', ['$event'])
    onDrop(event: any) {
        event.preventDefault();

        const file: File = this.validate(event.dataTransfer || event.target) as File;

        if (!file && this.state !== 'success') {
            this.state = 'error';
            this.detail = '400: Invalid file provided';
        }

        const meta = this.getMeta();
        const reader = new FileReader();
        reader.addEventListener('load', () => {
            const name = file.name;
            const usage = this.usage;
            const type = meta.type;

            this.resizeOnCanvas(reader.result, meta.width, meta.height).then((canvas) => canvas.toBlob((data) => this.imageService.create(data, { name, type, usage }), type));
        });
        reader.readAsDataURL(file);

    }

}
