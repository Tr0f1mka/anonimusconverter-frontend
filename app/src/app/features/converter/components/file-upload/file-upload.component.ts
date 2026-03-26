import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

@Component({
    selector: 'app-file-upload',
    templateUrl: 'file-upload.component.html',
    styleUrl: 'file-upload.component.css'
})
export class FileUploadComponent {
    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
    @Output() fileSelected = new EventEmitter<File | null>();
    
    selectedFile: File | null = null;
    acceptedFileTypes = '.json,.csv,.xml';

    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            this.selectedFile = input.files[0];
            this.fileSelected.emit(this.selectedFile);
        }
    }

    reset(): void {
        this.selectedFile = null;
        this.fileInput.nativeElement.value = '';
        this.fileSelected.emit(null);
    }
}