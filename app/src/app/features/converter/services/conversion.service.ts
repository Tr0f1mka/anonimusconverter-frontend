import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { FileFormat } from '../../../core/models/format.model';
import { APIPathes } from 'src/app/api-pathes';
import { LanguageService } from 'src/app/core/services/language.service';

export interface ConversionRequest {
    file: File;
    sourceFormat: FileFormat;
    targetFormat: FileFormat;
    patternId: string | null;
    options?: any;
}

@Injectable(
    {providedIn: 'root'}
)
export class ConversionService {
    private apiUrl = APIPathes.convert;
    private currentConversion: ConversionRequest | null = null;

    constructor(
        private http: HttpClient,
        private language_service: LanguageService
    ) {
        console.log('ConversionService инициализирован');
    }

    // Сохраняем текущую конвертацию
    setCurrentConversion(data: ConversionRequest): void {
        console.log('Сохранение данных конвертации:', data);
        console.log('Имя файла:', data.file.name);
        console.log('Размер файла:', data.file.size);
        console.log('Тип файла:', data.file.type);
        
        this.currentConversion = data;
        
        // Проверяем, что данные сохранились
        console.log('Данные сохранены, проверка:', this.currentConversion);
    }

    // Получаем сохраненную конвертацию
    getCurrentConversion(): ConversionRequest | null {
        console.log('Получение данных конвертации:', this.currentConversion);
        
        // Если данных нет, возвращаем null
        if (!this.currentConversion) {
          console.log('Данные конвертации отсутствуют');
          return null;
        }
        
        // Проверяем, что файл все еще существует
        if (!this.currentConversion.file) {
          console.log('Файл отсутствует в сохраненных данных');
          return null;
        }
        
        return this.currentConversion;
    }

    // Очищаем сохраненную конвертацию
    clearCurrentConversion(): void {
        console.log('Очистка данных конвертации');
        this.currentConversion = null;
    }

    // Отправка файла на конвертацию и получение готового файла
    // convert(request: ConversionRequest): Observable<HttpResponse<Blob>> {
    //     const formData = new FormData();
    //     formData.append('file', request.file);
    //     formData.append('patternId', request.patternId || '');
        
    //     if (request.options) {
    //         formData.append('options', JSON.stringify(request.options));
    //     }
        
    //     console.log(`${this.apiUrl}/${request.sourceFormat}/${request.targetFormat}`)
    //     // Отправляем запрос и ожидаем файл в ответе
    //     return this.http.post(`${this.apiUrl}/${request.sourceFormat}/${request.targetFormat}`, formData, {
    //         responseType: 'blob',
    //         observe: 'response'
    //     });
    // }


    convert(request: ConversionRequest): Observable<HttpResponse<Blob>> {
        const formData = new FormData();
        formData.append('file', request.file);

        if (request.options) {
            formData.append('options', JSON.stringify(request.options));
        }

        let url = `${this.apiUrl}/${request.sourceFormat}/${request.targetFormat}`;
        
        const requestOptions: {
            responseType: 'blob';
            observe: 'response';
            withCredentials: true;
        } = {
            responseType: 'blob',
            observe: 'response',
            withCredentials: true
        };

        if (request.patternId) {
            url = `${url}?pattern=${encodeURIComponent(request.patternId)}`;
        }

        return this.http.post(url, formData, requestOptions);
    }
}