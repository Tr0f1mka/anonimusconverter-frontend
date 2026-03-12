export enum FileFormat {
    JSON = 'json',
    CSV = 'csv',
    YAML = 'yaml',
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
    { format: FileFormat.YAML, extension: '.yaml', mimeType: 'application/x-yaml', name: 'YAML' },
    { format: FileFormat.YAML, extension: '.yml', mimeType: 'application/x-yaml', name: 'YAML' }
];

export const OUTPUT_FORMATS: FormatInfo[] = [
    { format: FileFormat.JSON, extension: '.json', mimeType: 'application/json', name: 'JSON' },
    { format: FileFormat.CSV, extension: '.csv', mimeType: 'text/csv', name: 'CSV' },
    { format: FileFormat.YAML, extension: '.yaml', mimeType: 'application/x-yaml', name: 'YAML' }
];