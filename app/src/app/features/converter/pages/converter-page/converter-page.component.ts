import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ConversionService } from '../../services/conversion.service';
import { FileValidationService } from '../../services/file-validation.service';
import { FormatDetectionService } from '../../../../core/services/format-detection.service';
import { ModalService } from '../../../../core/services/modal.service';
import { LanguageService } from '../../../../core/services/language.service';
import { AuthService } from '../../../../core/services/auth.service';
import { FileUploadComponent } from '../../components/file-upload/file-upload.component';
import { FileFormat, FormatInfo, OUTPUT_FORMATS } from '../../../../core/models/format.model';
import { Pattern } from '../../../../core/models/pattern.model';

@Component({
    selector: 'app-converter-page',
    templateUrl: 'converter-page.component.html',
    styleUrl: 'converter-page.component.css'
})
export class ConverterPageComponent {
    @ViewChild('fileUpload') fileUploadComponent!: FileUploadComponent;
    
    FileFormat = FileFormat;
    
    selectedFile: File | null = null;
    sourceFormat: FileFormat = FileFormat.UNKNOWN;
    sourceFormatInfo: FormatInfo | null = null;
    targetFormat: FormatInfo | null = OUTPUT_FORMATS[0]; // По умолчанию JSON
    selectedPattern: Pattern | null = null;
    isConverting = false;

    constructor(
        private conversionService: ConversionService,
        private fileValidationService: FileValidationService,
        private formatDetectionService: FormatDetectionService,
        private modalService: ModalService,
        private languageService: LanguageService,
        private authService: AuthService,
        private router: Router
    ) {}

    get sourceFormatDisplay(): string {
        if (this.sourceFormat === FileFormat.UNKNOWN) {
            return '?';
        }
        return this.formatDetectionService.getFormatDisplayName(this.sourceFormat);
    }


    showHelpModal(): void {
        this.modalService.open({
            id: 'help-modal',
            title: this.languageService.translate('helpTitle'),
            content: [
                this.languageService.translate('helpContent1'),
                this.languageService.translate('helpContent2')
            ],
            type: 'help',
            size: 'medium'
        });
    }


    isSameFormat(): boolean {
        //Проверка одинаковых форматов
        if (!this.targetFormat || this.sourceFormat === FileFormat.UNKNOWN) {
            return false;
        }
        return this.sourceFormat === this.targetFormat.format;
    }

    
    canConvert(): boolean {
        //Проверка необходимых для конвертации условий
        if (!this.selectedFile || !this.targetFormat || this.isConverting) {
            return false;
        }
        
        return !this.isSameFormat();
    }

    onFileSelected(file: File | null): void {
        this.selectedFile = file;
        
        if (file) {
            // Валидация файла
            const validation = this.fileValidationService.validateFile(file);
            
            if (!validation.valid) {
                this.modalService.open({
                    id: 'file-error-modal',
                    title: this.languageService.translate('errorTitle'),
                    content: [validation.error || this.languageService.translate('unknownError')],
                    type: 'warning',
                    size: 'small'
                });
                this.removeFile();
                return;
            }
            
            // Определяем формат файла
            const detected = this.formatDetectionService.detectFormatFromFile(file);
            this.sourceFormat = detected.format;
            this.sourceFormatInfo = detected.info;
            
            // Если формат не определен, показываем предупреждение
            if (this.sourceFormat === FileFormat.UNKNOWN) {
                this.modalService.open({
                    id: 'format-warning',
                    title: this.languageService.translate('unknownFormat'),
                    content: [this.languageService.translate('unknownFormatDescription')],
                    type: 'warning',
                    size: 'small'
                });
            }
        } else {
            this.sourceFormat = FileFormat.UNKNOWN;
            this.sourceFormatInfo = null;
        }
    }

    onTargetFormatChange(format: FormatInfo): void {
        this.targetFormat = format;
        
        // Если форматы совпадают и шаблон не выбран, показываем подсказку
        if (this.isSameFormat() && this.selectedFile && !this.selectedPattern) {
            this.modalService.open({
                id: 'pattern-required-hint',
                title: this.languageService.translate('formatRequired'),
                content: [this.languageService.translate('formatRequiredDescription')],
                type: 'info',
                size: 'small'
            });
        }
    }

    onPatternSelected(pattern: Pattern | null): void {
        this.selectedPattern = pattern;
    }

    removeFile(): void {
        this.selectedFile = null;
        this.sourceFormat = FileFormat.UNKNOWN;
        this.sourceFormatInfo = null;
        this.fileUploadComponent.reset();
    }

    convert(): void {
        console.log('Метод convert вызван');
        console.log('selectedFile:', this.selectedFile);
        console.log('targetFormat:', this.targetFormat);
        console.log('selectedPattern:', this.selectedPattern);
        
        if (!this.selectedFile || !this.targetFormat) {
            console.log('Нет файла или формата');
            return;
        }
        
        // Дополнительная проверка перед конвертацией
        if (this.isSameFormat() && !this.selectedPattern) {
            this.modalService.open({
            id: 'pattern-required-error',
            title: this.languageService.translate('errorTitle'),
            content: [this.languageService.translate('formatRequiredDescription')],
            type: 'warning',
            size: 'small'
            });
            return;
        }
        
        this.isConverting = true;
        console.log('Начинаем конвертацию...');
        
        // Подготавливаем данные для отправки
        const conversionData = {
            file: this.selectedFile,
            sourceFormat: this.sourceFormat,
            targetFormat: this.targetFormat.format,
            patternId: this.selectedPattern ? this.selectedPattern.id : null,
            options: {}
        };
        
        console.log('Данные конвертации:', conversionData);
        console.log('Имя файла для сохранения:', conversionData.file.name);
        
        // Сохраняем данные в сервисе
        this.conversionService.setCurrentConversion(conversionData);
        
        // Проверяем, что данные сохранились
        const savedData = this.conversionService.getCurrentConversion();
        console.log('Проверка сохраненных данных:', savedData);
        
        if (!savedData) {
            console.error('Данные не сохранились!');
            this.modalService.open({
                id: 'save-error',
                title: this.languageService.translate('errorTitle'),
                content: [this.languageService.translate('saveDataError')],
                type: 'warning',
                size: 'small'
            });
            this.isConverting = false;
            return;
        }
        
        // Перенаправляем на страницу загрузки
        console.log('Перенаправляем на /converter/download');
        this.router.navigate(['/converter/download']).then(success => {
            console.log('Навигация успешна:', success);
            if (!success) {
                console.error('Навигация не удалась');
                this.isConverting = false;
            }
        }).catch(error => {
            console.error('Ошибка навигации:', error);
            this.isConverting = false;
        });
    }

    getFileTypeDisplay(): string {
        if (this.sourceFormatInfo) {
            return this.sourceFormatInfo.name;
        }
        return this.selectedFile?.type || 'Неизвестный тип';
    }

    formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}