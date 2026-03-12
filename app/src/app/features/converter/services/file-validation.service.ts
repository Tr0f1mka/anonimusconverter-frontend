import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FileValidationService {
    private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
    private readonly ALLOWED_TYPES = ['json', 'csv', 'yaml'];
    private readonly ALLOWED_MIME_TYPES = [
        'application/json',
        'text/csv',
        'text/yaml',
        'application/x-yaml'
    ];

    validateFile(file: File): { valid: boolean; error?: string } {
        // Валидация файла: размер, тип
        // Проверка размера
        if (file.size > this.MAX_FILE_SIZE) {
            return {
                valid: false,
                error: `Файл слишком большой. Максимальный размер: ${this.formatFileSize(this.MAX_FILE_SIZE)}`
            };
        }

        // Проверка типа файла по расширению
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (!extension || !this.ALLOWED_TYPES.includes(extension)) {
            return {
                valid: false,
                error: `Неподдерживаемый тип файла. Разрешены: ${this.ALLOWED_TYPES.join(', ')}`
            };
        }

        // Проверка MIME типа (если доступен)
        if (file.type && !this.ALLOWED_MIME_TYPES.includes(file.type)) {
            // Не блокируем, только предупреждаем
            console.warn('Необычный MIME тип:', file.type);
        }

        return { valid: true };
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}