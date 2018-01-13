import { AfterContentInit, Component, ContentChild, ElementRef, HostListener, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { ImageInputControl } from './image-input.control';
import { ImageService } from './image-upload.service';

@Component({
    selector: 'venzra-image-upload',
    exportAs: 'venzraImageUpload',
    templateUrl: 'image-upload.component.html',
    styleUrls: ['image-upload.component.scss'],
    providers: [ImageService]
})
export class ImageUploadComponent implements AfterContentInit {

    protected _accept: Array<string> = [];

    public touched = false;
    public state: 'info' | 'success' | 'error' = 'info';
    public detail: any;
    public image: string;
    public mode: string;
    public progress: number;
    public background: any;

    @Input() target = '';

    @Input() usage = '';

    @Input()
    get accept() { return this._accept.join(', '); }
    set accept(value: any) { this._accept = value.split(',').map((option) => option.trim()); }

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

        this.imageService.image.subscribe((image) => {
            if (image && image._id) {
                this.setValue(image._id);
                this.showImage(image._id);
            } else {
                this.showImage(null);
            }
        });
    }

    ngAfterContentInit(): void {
        const value = this.control.ngControl.value;

        if (value) {
            this.showImage(value);
        }
    }

    showImage(reference) {
        if (reference) {
            this.image = `/api/images/${reference}`;
            this.background = this.sanitizer.bypassSecurityTrustStyle(`url(${this.image})`);
        } else {
            this.image = null;
            this.background = null;
        }
        this.state = 'success';
    }

    setValue(value: string) {
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
                return { limit: 1000 * 1000, width: 1024, height: 500, mode: 'crop' };
            case 'promotion':
                return { limit: 1000 * 1000, width: 512, height: 512, mode: 'crop' };
            case 'icon':
                return { limit: 400 * 1000, width: 180, height: 180, mode: 'crop' };
            case 'logo':
                return { limit: 1000 * 1000, width: 400, height: 100, mode: 'ratio' };
        }
    }

    formatRequirements() {
        const meta = this.getMeta();

        return [
            meta.mode === 'crop' ? `${meta.width} * ${meta.height}px` : `${meta.width}px wide or ${meta.height}px high`,
            this.accept
        ];
    }

    validate(data): File | boolean {
        const file = data ? data.files[0] : null;
        if (file && this._accept.length > 0) {
            if (this._accept.indexOf(file.type) === -1) {
                this.detail = file.type;
                return false;
            }
        }
        return file || true;
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

        if (file.size > meta.limit && this.state !== 'success') {
            this.state = 'error';
            this.detail = '413: Payload Too Large';
        }

        if (file.size <= meta.limit) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                const name = file.name;
                const usage = this.usage;
                const type = file.type;
                const data = reader.result;

                this.imageService.create(data, { name, type, usage });
            });
            reader.readAsArrayBuffer(file);
        }

    }

}
