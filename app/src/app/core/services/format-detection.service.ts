import { Injectable } from '@angular/core';
import { FileFormat, SUPPORTED_FORMATS, FormatInfo } from '../models/format.model';

@Injectable({
    providedIn: 'root'
})
export class FormatDetectionService {
    
    detectFormatFromFile(file: File): { format: FileFormat; info: FormatInfo | null } {
        // 1. Пробуем определить по расширению
        const extension = this.getFileExtension(file.name);
        const formatByExt = this.detectFormatByExtension(extension);
        
        if (formatByExt.format !== FileFormat.UNKNOWN) {
            return formatByExt;
        }
        
        // 2. Пробуем определить по MIME-типу
        const formatByMime = this.detectFormatByMimeType(file.type);
        if (formatByMime.format !== FileFormat.UNKNOWN) {
            return formatByMime;
        }
        
        // 3. Если не удалось определить, возвращаем unknown
        return { format: FileFormat.UNKNOWN, info: null };
    }
    
    detectFormatByExtension(extension: string): { format: FileFormat; info: FormatInfo | null } {
        const ext = extension.toLowerCase();
        
        for (const format of SUPPORTED_FORMATS) {
            if (format.extension === `.${ext}` || format.extension === ext) {
                return { format: format.format, info: format };
            }
        }
        
        return { format: FileFormat.UNKNOWN, info: null };
    }
    
    detectFormatByMimeType(mimeType: string): { format: FileFormat; info: FormatInfo | null } {
        if (!mimeType) return { format: FileFormat.UNKNOWN, info: null };
        
        for (const format of SUPPORTED_FORMATS) {
            if (format.mimeType === mimeType) {
                return { format: format.format, info: format };
            }
        }
        
        return { format: FileFormat.UNKNOWN, info: null };
    }
    
    private getFileExtension(filename: string): string {
        return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
    }
    
    getFormatDisplayName(format: FileFormat): string {
        const formatInfo = SUPPORTED_FORMATS.find(f => f.format === format);
        return formatInfo ? formatInfo.name : format.toString().toUpperCase();
    }
    
    isFormatSupported(format: FileFormat): boolean {
        return format !== FileFormat.UNKNOWN;
    }
}