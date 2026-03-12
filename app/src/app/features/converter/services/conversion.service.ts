import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FileFormat } from '../../../core/models/format.model';
import { APIPathes } from 'src/app/api-pathes';

export interface ConversionRequest {
    file: File;
    sourceFormat: FileFormat;
    targetFormat: FileFormat;
    templateId: string | null;
    options?: any;
}

export interface ConversionStatus {
    jobId: string;
    state: 'pending' | 'processing' | 'completed' | 'failed';
    error?: string;
    downloadUrl?: string;
    fileName?: string;
    fileSize?: number;
}

@Injectable()
export class ConversionService {
    private apiUrl = APIPathes.convert;
    private currentConversion: ConversionRequest | null = null;

    constructor(private http: HttpClient) {}


    setCurrentConversion(data: ConversionRequest): void {
        // Сохраняем текущую конвертацию
        this.currentConversion = data;
    }


    getCurrentConversion(): ConversionRequest | null {
        // Получаем сохраненную конвертацию
        return this.currentConversion;
    }


    clearCurrentConversion(): void {
        // Очищаем сохраненную конвертацию
        this.currentConversion = null;
    }


    convert(request: ConversionRequest): Observable<string> {
        // Отправка файла на конвертацию

        console.log('Конвертация начата:', request);
        // Реальный запрос:
        /*
        const formData = new FormData();
        formData.append('file', request.file);
        formData.append('sourceFormat', request.sourceFormat);
        formData.append('targetFormat', request.targetFormat);
        formData.append('templateId', request.templateId || '');
        
        if (request.options) {
            formData.append('options', JSON.stringify(request.options));
        }
        
        return this.http.post<{jobId: string}>(this.apiUrl, formData).pipe(
            map(response => response.jobId)
        );
        */
        
        // Заглушка для демонстрации
        return of(`job_${Date.now()}`).pipe(delay(1000));
    }

    // Проверка статуса конвертации
    checkStatus(jobId: string): Observable<ConversionStatus> {
        // Реальный запрос:
        // return this.http.get<ConversionStatus>(`${this.apiUrl}/${jobId}/status`);
        
        // Заглушка для демонстрации
        const random = Math.random();
        let status: ConversionStatus;
        
        if (random < 0.7) {
            status = {
                jobId,
                state: 'processing'
            };
        } else if (random < 0.9) {
            status = {
                jobId,
                state: 'completed',
                downloadUrl: 'API' + jobId,
                fileName: 'converted_file.' + (this.currentConversion?.targetFormat || 'txt'),
                fileSize: 1024 * 1024 // 1 MB для примера
            };
        } else {
            status = {
                jobId,
                state: 'failed',
                error: 'Ошибка при конвертации файла'
            };
        }
        
        return of(status).pipe(delay(500));
    }

    
    getDownloadUrl(jobId: string): string {
        // Получение URL для скачивания
        return `${this.apiUrl}/${jobId}/download`;
    }
}