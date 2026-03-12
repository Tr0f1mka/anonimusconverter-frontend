export type Language = 'ru' | 'en';

export interface Translation {
    [key: string]: {
        ru: string;
        en: string;
    };
}

export const TRANSLATIONS: Translation = {
    'converter': { ru: 'Конвертер', en: 'Converter' },
    'templates': { ru: 'Шаблоны', en: 'Templates' },
    'login': { ru: 'Войти', en: 'Login' },
    'logout': { ru: 'Выйти', en: 'Logout' },
    'json': { ru: 'JSON', en: 'JSON' },
    'csv': { ru: 'CSV', en: 'CSV' },
    'selectFile': { ru: 'Выбрать файл', en: 'Select file' },
    'selectTemplate': { ru: 'Выбрать шаблон', en: 'Select template' },
    'convert': { ru: 'Конвертировать', en: 'Convert' },
    'help': { ru: 'Помощь', en: 'Help' },
    'forDevelopers': { ru: 'Для разработчиков', en: 'For developers' },
    'copyright': { ru: '© 2026 Анонимусы. Все права защищены.', en: '© 2026 Anonymous. All rights reserved.' },
    'helpTitle': { ru: 'Помощь', en: 'Help' },
    'devTitle': { ru: 'Для разработчиков', en: 'For developers' },
    'helpContent1': { 
        ru: 'Этот конвертер поддерживает преобразование между форматами JSON, CSV и YAML.', 
        en: 'This converter supports conversion between JSON, CSV and YAML.' 
    },
    'helpContent2': { 
        ru: 'Выберите файл, укажите шаблон (если необходимо) и нажмите "Конвертировать".', 
        en: 'Select a file, specify a template (if necessary) and click "Convert".' 
    },
    'apiEndpoint': { ru: 'API доступен по адресу:', en: 'API available at:' },
    'documentation': { ru: 'Документация:', en: 'Documentation:' },
    'github': { ru: 'GitHub:', en: 'GitHub:' }
};