import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { switchMap, catchError, takeWhile } from 'rxjs/operators';
import { ConversionService } from '../../services/conversion.service';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
    selector: 'app-download-page',
    templateUrl: 'download-page.component.html',
    styleUrl: 'download-page.component.css'
})
export class DownloadPageComponent implements OnInit, OnDestroy {
    conversionData: any = null;
    downloadUrl: string | null = null;
    convertedFileName: string = '';
    convertedFileSize: string = '';
    targetFormatDisplay: string = '';
    error: string | null = null;
    
    private pollingSubscription: Subscription | null = null;
    private isActive = true;

    constructor(
        private conversionService: ConversionService,
        private modalService: ModalService,
        private router: Router
    ) {}

    ngOnInit(): void {
        // Получаем данные конвертации
        this.conversionData = this.conversionService.getCurrentConversion();
        
        if (!this.conversionData) {
            // Если нет данных, перенаправляем на главную
            this.router.navigate(['/']);
            return;
        }
        
        // Запускаем процесс конвертации
        this.startConversion();
    }

    ngOnDestroy(): void {
        this.isActive = false;
        this.stopPolling();
    }

    startConversion(): void {
        // Отправляем файл на сервер
        this.conversionService.convert(this.conversionData).subscribe({
            next: (jobId) => {
                // Начинаем опрос статуса
                this.startPolling(jobId);
            },
            error: (error) => {
                if (this.isActive) {
                    this.error = 'Не удалось начать конвертацию. Пожалуйста, попробуйте снова.';
                    console.error('Conversion start error:', error);
                }
            }
        });
    }

    startPolling(jobId: string): void {
        let attempts = 0;
        const maxAttempts = 60; // Максимум 60 попыток (2 минуты при интервале 2 сек)
        
        this.pollingSubscription = interval(2000).pipe(
            switchMap(() => this.conversionService.checkStatus(jobId)),
            takeWhile(() => this.isActive), // Продолжаем пока компонент активен
            catchError((error) => {
                if (this.isActive) {
                    this.error = 'Ошибка при проверке статуса конвертации';
                    console.error('Status check error:', error);
                    this.stopPolling();
                }
                throw error;
            })
        ).subscribe({
            next: (status) => {
                if (!this.isActive) return;
                
                attempts++;
                
                // Проверяем статус
                if (status.state === 'completed') {
                    // Конвертация завершена
                    this.handleCompleted(status);
                } else if (status.state === 'failed') {
                    // Ошибка конвертации
                    this.error = status.error || 'Неизвестная ошибка конвертации';
                    this.stopPolling();
                } else if (attempts >= maxAttempts) {
                    // Превышено время ожидания
                    this.error = 'Превышено время ожидания конвертации';
                    this.stopPolling();
                }
            },
            error: (error) => {
                if (this.isActive) {
                    this.error = 'Ошибка при проверке статуса';
                    console.error('Polling error:', error);
                }
            }
        });
    }

    handleCompleted(status: any): void {
        this.stopPolling();
        
        // Создаем URL для скачивания
        this.downloadUrl = status.downloadUrl || this.conversionService.getDownloadUrl(status.jobId);
        this.convertedFileName = status.fileName || `converted.${this.conversionData.targetFormat}`;
        this.convertedFileSize = this.formatFileSize(status.fileSize || 0);
        this.targetFormatDisplay = this.conversionData.targetFormat.toUpperCase();
    }

    stopPolling(): void {
        if (this.pollingSubscription) {
            this.pollingSubscription.unsubscribe();
            this.pollingSubscription = null;
        }
    }

    retryConversion(): void {
        this.error = null;
        this.downloadUrl = null;
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