import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FileFormat } from '../../../core/models/format.model';
import { APIPathes } from 'src/app/api-pathes';

export interface ConversionRequest {
  file: File;
  sourceFormat: FileFormat;
  targetFormat: FileFormat;
  templateId: string | null;
  options?: any;
}

@Injectable(
    {providedIn: 'root'}
)
export class ConversionService {
  private apiUrl = APIPathes.convert;
  private currentConversion: ConversionRequest | null = null;

  constructor(private http: HttpClient) {
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
  convert(request: ConversionRequest): Observable<HttpResponse<Blob>> {
    const formData = new FormData();
    formData.append('file', request.file);
    // formData.append('templateId', request.templateId || '');
    
    if (request.options) {
      formData.append('options', JSON.stringify(request.options));
    }
    
    console.log(`${this.apiUrl}/${request.sourceFormat}_${request.targetFormat}`)
    // Отправляем запрос и ожидаем файл в ответе
    return this.http.post(`${this.apiUrl}/${request.sourceFormat}_${request.targetFormat}`, formData, {
      responseType: 'blob',
      observe: 'response'
    });
  }
}