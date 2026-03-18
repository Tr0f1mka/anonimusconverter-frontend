import { Component, OnInit, OnDestroy, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
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
  errorStatus: number | null = null;
  isCompleted: boolean = false;
  private isActive = true;

  constructor(
    private conversionService: ConversionService,
    private modalService: ModalService,
    private router: Router,
    private cdr: ChangeDetectorRef,  // <-- Добавляем для принудительного обновления
    private ngZone: NgZone  // <-- Добавляем для работы с зонами Angular
  ) {}

  ngOnInit(): void {
    console.log('DownloadPageComponent инициализирован');
    console.log('Текущий URL:', window.location.href);
    
    // Получаем данные конвертации
    this.conversionData = this.conversionService.getCurrentConversion();
    
    console.log('Данные конвертации из сервиса:', this.conversionData);
    
    if (!this.conversionData) {
      console.log('Нет данных конвертации, показываем сообщение и перенаправляем');
      
      this.modalService.open({
        id: 'no-data-error',
        title: 'Ошибка',
        content: ['Данные конвертации не найдены. Пожалуйста, начните заново.'],
        type: 'warning',
        size: 'small'
      });
      
      setTimeout(() => {
        if (this.isActive) {
          this.ngZone.run(() => {  // <-- Запускаем в зоне Angular
            this.router.navigate(['/']);
          });
        }
      }, 2000);
      
      return;
    }
    
    // Проверяем наличие файла
    if (!this.conversionData.file) {
      console.log('Файл отсутствует в данных');
      this.error = 'Файл не найден';
      this.cdr.detectChanges();  // Принудительное обновление
      return;
    }
    
    console.log('Файл для конвертации:', this.conversionData.file.name);
    console.log('Размер файла:', this.conversionData.file.size);
    
    // Запускаем конвертацию
    console.log('Запускаем конвертацию');
    this.startConversion();
  }

  ngOnDestroy(): void {
    this.isActive = false;
    // Очищаем созданный URL
    if (this.downloadUrl) {
      window.URL.revokeObjectURL(this.downloadUrl);
    }
  }

  startConversion(): void {
    console.log('startConversion вызван');
    
    // Для реального API
    this.conversionService.convert(this.conversionData).subscribe({
      next: (response: HttpResponse<Blob>) => {
        console.log('Получен ответ от сервера:', response);
        
        if (!this.isActive) return;
        
        // Проверяем статус ответа
        if (response.status === 200 && response.body) {
          this.ngZone.run(() => {  // <-- Важно: запускаем в зоне Angular
            this.handleSuccess(response);
          });
        } else {
          this.ngZone.run(() => {
            this.handleError(`Неожиданный статус ответа: ${response.status}`, response.status);
          });
        }
      },
      error: (error) => {
        console.error('Ошибка конвертации:', error);
        
        if (this.isActive) {
          this.ngZone.run(() => {
            const status = error.status || 500;
            const message = error.error?.message || error.message || 'Неизвестная ошибка';
            this.handleError(message, status);
          });
        }
      }
    });
  }

  handleSuccess(response: HttpResponse<Blob>): void {
    console.log('handleSuccess вызван');
    
    this.isCompleted = true;
    
    // Получаем имя файла из заголовка Content-Disposition если есть
    const contentDisposition = response.headers.get("Content-Disposition");
    let fileName = `converted.${this.conversionData.targetFormat}`;
    console.log('Content-Disposition:', contentDisposition);
    console.log("HEADERS:", response.headers.keys());
    console.log("HEADERSTYPE:", response.headers.keys().map(key => typeof(key)));
    console.log("Content-Type: ", response.headers.get("Content-Type"));
    console.log("Content-Length: ", response.headers.get("Content-Length"));
    if (contentDisposition) {
      const matches = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      // const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      console.log(matches);
      if (matches != null && matches[1]) {
        fileName = matches[1].replace(/['"]/g, '').trim();
      }
    }
    console.log("FileName: ", fileName);
    
    // Создаем URL для скачивания
    if (this.downloadUrl) {
      window.URL.revokeObjectURL(this.downloadUrl);
    }

    this.downloadUrl = window.URL.createObjectURL(response.body as Blob);
    this.convertedFileName = fileName;
    this.convertedFileSize = this.formatFileSize((response.body as Blob).size);
    this.targetFormatDisplay = this.conversionData.targetFormat.toUpperCase();
    
    console.log('Конвертация успешна:', {
      status: response.status,
      fileName: fileName,
      fileSize: (response.body as Blob).size,
      downloadUrl: this.downloadUrl,
      isCompleted: this.isCompleted
    });
    
    // Принудительно обновляем представление
    this.cdr.detectChanges();
    
    // Проверяем, что шаблон должен показать ready-state
    console.log('Состояние после обновления:', {
      isCompleted: this.isCompleted,
      downloadUrl: this.downloadUrl,
      error: this.error
    });
  }

  handleError(message: string, status: number): void {
    console.log('handleError вызван:', message, status);
    this.error = message;
    this.errorStatus = status;
    this.cdr.detectChanges();  // <-- Принудительное обновление
  }

  retryConversion(): void {
    console.log('retryConversion вызван');
    this.error = null;
    this.errorStatus = null;
    this.downloadUrl = null;
    this.isCompleted = false;
    this.cdr.detectChanges();
    this.startConversion();
  }

  startNewConversion(): void {
    console.log('startNewConversion вызван');
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