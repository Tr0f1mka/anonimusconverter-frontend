export type Language = 'ru' | 'en';

export interface Translation {
    [key: string]: {
        ru: string;
        en: string;
    };
}

export const TRANSLATIONS: Translation = {
    'converter': { ru: 'Конвертер', en: 'Converter' },
    'patterns': { ru: 'Шаблоны', en: 'Patterns' },
    'login': { ru: 'Войти', en: 'Login' },
    'logout': { ru: 'Выйти', en: 'Logout' },
    'selectFile': { ru: 'Выбрать файл', en: 'Select file' },
    'selectPattern': { ru: 'Выбрать шаблон', en: 'Select pattern' },
    'convert': { ru: 'Конвертировать', en: 'Convert' },
    'help': { ru: 'Помощь', en: 'Help' },
    'forDevelopers': { ru: 'Для разработчиков', en: 'For developers' },
    'copyright': { ru: '© 2026 Анонимусы. Все права защищены.', en: '© 2026 Anonymous. All rights reserved.' },
    'helpTitle': { ru: 'Помощь', en: 'Help' },
    'devTitle': { ru: 'Для разработчиков', en: 'For developers' },
    'helpContent1': { 
        ru: 'Этот конвертер поддерживает преобразование между форматами JSON, CSV и XML.', 
        en: 'This converter supports conversion between JSON, CSV and XML.' 
    },
    'helpContent2': { 
        ru: 'Выберите файл, укажите шаблон (если необходимо) и нажмите "Конвертировать".', 
        en: 'Select a file, specify a pattern (if necessary) and click "Convert".' 
    },
    'apiEndpoint': { ru: 'API доступен по адресу:', en: 'API available at:' },
    'documentation': { ru: 'Документация:', en: 'Documentation:' },
    'github': { ru: 'GitHub:', en: 'GitHub:' },
    'entrance': { ru: 'Вход', en: 'Entrance' },
    'entranceInSystem': { ru: 'Вход в систему', en: 'Entrance in system' },
    'registration': { ru: 'Регистрация', en: 'Registration' },
    'name': { ru: 'Имя', en: 'Name' },
    'inputName': { ru: 'Введите имя', en: 'Enter the name' },
    'password': { ru: 'Пароль', en: 'Password' },
    'confirmPassword': { ru: 'Подтверждение пароля', en: 'Confirm password' },
    'repeatPassword': { ru: 'Повторите пароль', en: 'Repeat password' },
    'inputPassword': { ru: 'Введите пароль', en: 'Enter the password' },
    'comeUpWithAPassword': { ru: 'Придумайте пароль', en: 'Come up with a password' },
    'register': { ru: 'Зарегистрироваться', en: 'Register' },
    'error404': { ru: 'Ошибка 404', en: 'Error 404' },
    'error404Message': { ru: 'Страница не существует', en: 'The page does not exist' },
    'onMain': { ru: 'На главную', en: 'Go to the main page' },
    'cancel': { ru: 'Отмена', en: 'Cancel' },
    'selectPattern1': { ru: 'Выберите шаблон', en: 'Select pattern' },
    'patternPageHelp': {
        ru: 'Здесь будут отображаться ваши шаблоны преобразования данных',
        en: 'Your data conversion patterns will be displayed here.'
    },
    'patternPageHelp1': {
        ru: 'Управляйте шаблонами преобразования полей: создавайте, просматривайте, редактируйте и удаляйте правила для JSON, CSV и XML.',
        en: 'Manage field conversion patterns: create, view, edit, and delete rules for JSON, CSV, and XML.'
    },
    'loadingPatterns': { ru: 'Загрузка шаблонов...', en: 'Uploading patterns...' },
    'searchPatterns': { ru: 'Поиск шаблонов...', en: 'Search for patterns...' },
    'createPattern': { ru: 'Создать шаблон', en: 'Create pattern' },
    'openPattern': { ru: 'Открыть', en: 'Open' },
    'changePattern': { ru: 'Изменить', en: 'Change' },
    'deletePattern': { ru: 'Удалить', en: 'Delete' },
    'forward': { ru: 'Вперёд', en: 'Forward' },
    'back': { ru: 'Назад', en: 'Back' },
    'unAuthPatterns': { ru: 'Войдите, чтобы начать работу с шаблонами', en: 'Login to start working with patterns' },
    'noPatterns': { ru: 'Шаблонов нет', en: 'There are no patterns' },
    'fileConversion': { ru: 'Конвертация файла', en: 'File Conversion' },
    'processConversion': { ru: 'Конвертация в процессе', en: 'Conversion in progress' },
    'waitPlease': {
        ru: 'Пожалуйста, подождите. Это может занять несколько секунд...',
        en: 'Please wait. This may take a few seconds...'
    },
    'file': { ru: 'Файл', en: 'File' },
    'fromFormat': { ru: 'Из формата', en: 'From format' },
    'toFormat': { ru: 'В формат', en: 'To format' },
    'dontClose': { ru: 'Не закрывайте страницу', en: 'Don\'t close the page'},
    'completeConversion': { ru: 'Конвертация завершена!', en: 'The conversion is complete!' },
    'completeConversion1': { ru: 'Ваш файл готов к скачиванию', en: 'Your file is ready for download' },
    'newConversion': { ru: 'Новая конвертация', en: 'New conversion' },
    'downloadFile': { ru: 'Скачать файл', en: 'Download file' },
    'conversionError': { ru: 'Ошибка конвертации', en: 'Conversion error' },
    'tryAgain': { ru: 'Попробовать снова', en: 'Try again' },
    'creatingPattern': { ru: 'Создание шаблона', en: 'Creating pattern' },
    'patternTitle': { ru: 'Название', en: 'Title' },
    'enterPatternName': { ru: 'Введите название шаблона', en: 'Enter the pattern name' },
    'modifications': { ru: 'Модификации', en: 'Modifications' },
    'oldName': { ru: 'Старое имя поля', en: 'Old field name' },
    'newName': { ru: 'Новое имя поля', en: 'New field name' },
    'noneType': { ru: 'Тип не задан', en: 'None type' },
    'newValue': { ru: 'Новое значение поля', en: 'New value of field' },
    'addModifications': { ru: 'Добавить модификацию', en: 'Add modifications' },
    'changePatternTitle': { ru: 'Изменение шаблона', en: 'Changing the pattern' },
    'savePattern': { ru: 'Сохранить шаблон', en: 'Save pattern' },
    'showPatternTitle': { ru: 'Просмотр шаблона', en: 'Viewing pattern' },
    'oldNameTitle': { ru: 'Старое имя', en: 'Old name' },
    'newNameTitle': { ru: 'Новое имя', en: 'New name' },
    'newTypeTitle': { ru: 'Новый тип', en: 'New type' },
    'newValueTitle': { ru: 'Новое значение', en: 'New value' },
    'showing': { ru: 'Показано', en: 'Showing' },
    'of': { ru: 'из', en: 'of' },
    'close': { ru: 'Закрыть', en: 'Close' },
    'emailRequired': { ru: 'Email обязателен', en: 'Email is required' },
    'bannedCharacters': {
        ru: 'Обнаружены недопустимые символы. Разрешены только буквы, цифры, _ ! # $ % & \' ( ) * + , - . / : ; < = > ? @ [ ] { } ^ ` | ~',
        en: 'Invalid characters detected. Only letters, numbers, and _ ! # $ % & \' ( ) * + , - . / : ; < = > ? @ [ ] { } ^ ` | ~ are allowed'
    },
    'invalidEmail': {
        ru: 'Введите корректный email (пример: name@domain.com)',
        en: 'Enter a valid email address (example: name@domain.com)'
    },
    'passwordRequired': { ru: 'Пароль обязателен', en: 'Password is required' },
    'invalidPasswordLength': {
        ru: 'Пароль должен содержать минимум 8 символов',
        en: 'The password must contain at least 8 characters.'
    },
    'passwordBannedCharacters': {
        ru: 'Пароль содержит недопустимые символы',
        en: 'The password contains invalid characters'
    },
    'nameRequired': { ru: 'Имя обязательно', en: 'Name is required' },
    'minLengthName': { ru: 'Имя должно иметь не менее 2 символов', en: 'The name must be at least 2 characters long' },
    'maxLengthName': { ru: 'Имя должно иметь не более 50 символов', en: 'The name must be at more 50 characters long' },
    'invalidName': {
        ru: 'Имя может содержать только буквы, цифры и символ подчеркивания',
        en: 'A name can only contain letters, numbers, and the underscore character.'
    },
    'confirmRequired': { ru: 'Подтверждение пароля обязательно', en: 'Password confirmation is required' },
    'passwordsMismatch': { ru: 'Пароли не совпадают', en: 'Пароли не совпадают' },
    'min8Symbols': { ru: 'Минимум 8 символов', en: 'Minimum of 8 characters' },
    'onlyAllowedCharacters': { ru: 'Только разрешенные символы', en: 'Only allowed characters' },
    'onPatternsPage': { ru: 'Перейти на страницу шаблонов', en: 'Go to the patterns page' },
    'typeMismatch': {
        ru: 'Новый тип ячейки не соответствует новому значению',
        en: 'The new cell type does not match the new value'

    },
    'oldNewValueRequired': {
        ru: 'Нужно ввести старое или новое имя ячейки',
        en: 'You need to enter the old or new cell name.'
    },
    'maxlength': { 
        ru: 'Нельзя вводить более 50 символов в поле', 
        en: 'You cannot enter more than 50 characters in the field' 
    },
    'minModificationsLength': { 
        ru: 'Обязательна хотя бы 1 модификация', 
        en: 'At least 1 modification is required' 
    },
    'errorTitle': { ru: 'Ошибка', en: 'Error' },
    'invalidEmailOrPassword': { ru: 'Неверный email или пароль', en: 'Invalid email or password' },
    'failedRegister': { ru: 'Не удалось зарегистрироваться', en: 'Failed to register' },
    'unknownError': { ru: 'Неизвестная ошибка', en: 'Unknown error' },
    'unknownFormat': { ru: 'Формат не определен', en: 'The format is not defined' },
    'unknownFormatDescription': { ru: 'Не удалось определить формат файла. Конвертация может не работать.', en: 'Could not determine file format. Conversion may not work.' },
    'formatRequired': { ru: 'Требуется шаблон', en: 'A pattern is required' },
    'formatRequiredDescription': { ru: 'Исходный и конечный форматы совпадают. Для конвертации необходимо поменять тип.', en: 'The source and destination formats are the same. You need to change the type to convert.' },
    'saveDataError': { ru: 'Не удалось сохранить данные конвертации', en: 'Couldn\'t save conversion data' },
    'conversionDataError': { ru: 'Данные конвертации не найдены. Пожалуйста, начните заново.', en: 'No conversion data found. Please start over.' },
    'deleteError': { ru: 'Не удалось удалить шаблон', en: 'Couldn\'t delete pattern' },
    'exit': { ru: 'Выход', en: 'Exit' },
    'exitDescription': { ru: 'Вы успешно вышли из системы', en: 'You have successfully logged out' },
    'authRequired': { ru: 'Требуется авторизация', en: 'Authorization is required' },
    'authRequiredDescription': { ru: 'Для создания шаблона необходимо войти в систему', en: 'To create a template, you need to log in' },
    'errorModificationLoad': { ru: 'Ошибка загрузки модификаций шаблона', en: 'Error loading pattern modifications' }
};