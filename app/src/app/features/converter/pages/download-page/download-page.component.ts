import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { ConversionService } from '../../services/conversion.service';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
    selector: 'app-download-page',
    templateUrl: './download-page.component.html',
    styleUrl: './download-page.component.css'
})
export class DownloadPageComponent implements OnInit, OnDestroy {
    conversionData: any = null;
    downloadUrl: string | null = null;
    convertedFileName: string = '';
    convertedFileSize: string = '';
    targetFormatDisplay: string = '';
    error: string | null = null;
    errorStatus: number | null = null;
    isCompleted: boolean = false;
    isLoading: boolean = true; // <-- Добавляем отдельный флаг загрузки
    private isActive = true;

    constructor(
        private conversionService: ConversionService,
        private modalService: ModalService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        console.log('DownloadPageComponent инициализирован');
        
        this.conversionData = this.conversionService.getCurrentConversion();
        
        if (!this.conversionData) {
            this.modalService.open({
                id: 'no-data-error',
                title: 'Ошибка',
                content: ['Данные конвертации не найдены. Пожалуйста, начните заново.'],
                type: 'warning',
                size: 'small'
            });
            
            setTimeout(() => this.router.navigate(['/']), 2000);
            return;
        }
        
        if (!this.conversionData.file) {
            this.error = 'Файл не найден';
            this.isLoading = false;
            return;
        }
        
        this.startConversion();
    }

    ngOnDestroy(): void {
        this.isActive = false;
        if (this.downloadUrl) {
            window.URL.revokeObjectURL(this.downloadUrl);
        }
    }

    extractFilenameFromContentDisposition(contentDisposition: string | null): string | null {
        if (!contentDisposition) return null;
        
        // Пробуем разные паттерны
        
        // 1. filename="name.ext" или filename=name.ext
        let match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (match && match[1]) {
            return match[1].replace(/['"]/g, '').trim();
        }
        
        // 2. filename*=UTF-8''name%20with%20spaces.ext
        match = contentDisposition.match(/filename\*=([^']+)'([^']*)'(.+)/);
        if (match) {
            try {
                return decodeURIComponent(match[3]);
            } catch (e) {
                console.error('Ошибка декодирования filename*:', e);
            }
        }
        
        // 3. Простой поиск filename= после ;
        const parts = contentDisposition.split(';');
        for (const part of parts) {
            const trimmed = part.trim();
            if (trimmed.startsWith('filename=')) {
                return trimmed.substring(9).replace(/['"]/g, '').trim();
            }
            if (trimmed.startsWith('filename*=')) {
                try {
                    const encodedName = trimmed.substring(10).split("'").pop() || '';
                    return decodeURIComponent(encodedName);
                } catch (e) {
                    console.error('Ошибка декодирования filename*:', e);
                }
            }
        }
        
        return null;
    }

    generateFilename(originalName: string, targetFormat: string): string {
        const lastDotIndex = originalName.lastIndexOf('.');
        const nameWithoutExt = lastDotIndex > 0 
                              ? originalName.substring(0, lastDotIndex) 
                              : originalName;
        
        const extension = targetFormat.startsWith('.') ? targetFormat : `.${targetFormat}`;
        
        return `${nameWithoutExt}${extension}`;
    }

    onDownloadClick(): void {
        if (!this.downloadUrl || !this.convertedFileName) {
            console.error('Нет данных для скачивания');
            return;
        }
        
        console.log('Скачивание файла:', this.convertedFileName);
        
        // Создаем ссылку и скачиваем
        const link = document.createElement('a');
        link.href = this.downloadUrl;
        link.download = this.convertedFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // НЕ очищаем URL здесь, так как он может понадобиться для повторного скачивания
    }

    startConversion(): void {
        console.log('startConversion вызван');
        this.isLoading = true;
        
        this.conversionService.convert(this.conversionData).subscribe({
            next: (response: HttpResponse<Blob>) => {
                console.log('Получен ответ от сервера:', response.status);
                
                if (!this.isActive) return;
                
                if (response.status === 200 && response.body) {
                    // Получаем имя файла
                    const contentDisposition = response.headers.get('Content-Disposition');
                    let filename = this.extractFilenameFromContentDisposition(contentDisposition);
                    
                    console.log('Имя из заголовка:', filename);
                    
                    if (!filename) {
                        const originalName = this.conversionData.file.name;
                        const targetFormat = this.conversionData.targetFormat;
                        filename = this.generateFilename(originalName, targetFormat);
                        console.log('Сгенерированное имя:', filename);
                    }
                    
                    const blobUrl = window.URL.createObjectURL(response.body);
                    
                    // Обновляем UI - теперь показываем кнопку скачивания
                    this.isCompleted = true;
                    this.isLoading = false;
                    this.downloadUrl = blobUrl;
                    this.convertedFileName = filename;
                    this.convertedFileSize = this.formatFileSize(response.body.size);
                    this.targetFormatDisplay = this.conversionData.targetFormat.toUpperCase();
                    
                    console.log('Готово к скачиванию:', {
                        fileName: filename,
                        fileSize: this.convertedFileSize,
                        downloadUrl: blobUrl
                    });
                    
                    // Принудительно обновляем представление
                    this.cdr.detectChanges();
                  
                } else {
                    this.handleError(`Ошибка: статус ${response.status}`, response.status);
                }
            },
            error: (error) => {
                console.error('Ошибка конвертации:', error);
                if (this.isActive) {
                    this.isLoading = false;
                    const status = error.status || 500;
                    const message = error.error?.message || error.message || 'Неизвестная ошибка';
                    this.handleError(message, status);
                }
            }
        });
    }

    handleError(message: string, status: number): void {
        this.error = message;
        this.errorStatus = status;
        this.isLoading = false;
        this.cdr.detectChanges();
    }

    retryConversion(): void {
        this.error = null;
        this.errorStatus = null;
        this.downloadUrl = null;
        this.isCompleted = false;
        this.isLoading = true;
        this.startConversion();
    }

    startNewConversion(): void {
        this.conversionService.clearCurrentConversion();
        this.router.navigate(['/']);
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}