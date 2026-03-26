export enum FileFormat {
    JSON = 'json',
    CSV = 'csv',
    XML = 'xml',
    UNKNOWN = 'unknown'
}

export interface FormatInfo {
    format: FileFormat;
    extension: string;
    mimeType: string;
    name: string;
}

export const SUPPORTED_FORMATS: FormatInfo[] = [
    { format: FileFormat.JSON, extension: '.json', mimeType: 'application/json', name: 'JSON' },
    { format: FileFormat.CSV, extension: '.csv', mimeType: 'text/csv', name: 'CSV' },
    { format: FileFormat.XML, extension: '.xml', mimeType: 'application/xml', name: 'XML' },
    { format: FileFormat.XML, extension: '.xml', mimeType: 'text/xml', name: 'XML' }
];

export const OUTPUT_FORMATS: FormatInfo[] = [
    { format: FileFormat.JSON, extension: '.json', mimeType: 'application/json', name: 'JSON' },
    { format: FileFormat.CSV, extension: '.csv', mimeType: 'text/csv', name: 'CSV' },
    { format: FileFormat.XML, extension: '.xml', mimeType: 'application/xml', name: 'XML' }
];