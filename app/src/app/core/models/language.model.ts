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
    'entrance': { ru: 'Вход', en: 'Sign In' },
    'entranceInSystem': { ru: 'Вход в систему', en: 'Sign In' },
    'registration': { ru: 'Регистрация', en: 'Registration' },
    'name': { ru: 'Имя', en: 'Name' },
    'inputName': { ru: 'Введите имя', en: 'Enter your name' },
    'password': { ru: 'Пароль', en: 'Password' },
    'confirmPassword': { ru: 'Подтверждение пароля', en: 'Confirm password' },
    'repeatPassword': { ru: 'Повторите пароль', en: 'Repeat password' },
    'inputPassword': { ru: 'Введите пароль', en: 'Enter your password' },
    'comeUpWithAPassword': { ru: 'Придумайте пароль', en: 'Create a password' },
    'register': { ru: 'Зарегистрироваться', en: 'Register' },
    'error404': { ru: 'Ошибка 404', en: 'Error 404' },
    'error404Message': { ru: 'Страница не существует', en: 'Page not found' },
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
    'loadingPatterns': { ru: 'Загрузка шаблонов...', en: 'Loading patterns...' },
    'searchPatterns': { ru: 'Поиск шаблонов...', en: 'Search for patterns...' },
    'createPattern': { ru: 'Создать шаблон', en: 'Create pattern' },
    'openPattern': { ru: 'Открыть', en: 'Open' },
    'changePattern': { ru: 'Изменить', en: 'Edit' },
    'deletePattern': { ru: 'Удалить', en: 'Delete' },
    'forward': { ru: 'Вперёд', en: 'Next' },
    'back': { ru: 'Назад', en: 'Back' },
    'unAuthPatterns': { ru: 'Войдите, чтобы начать работу с шаблонами', en: 'Login to start working with patterns' },
    'noPatterns': { ru: 'Шаблонов нет', en: 'No patterns found' },
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
    'completeConversion': { ru: 'Конвертация завершена!', en: 'Conversion complete!' },
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
    'noneType': { ru: 'Тип не задан', en: 'Type not set' },
    'newValue': { ru: 'Новое значение поля', en: 'New field value' },
    'addModifications': { ru: 'Добавить модификацию', en: 'Add modification' },
    'changePatternTitle': { ru: 'Изменение шаблона', en: 'Edit pattern' },
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
    'maxLengthName': { ru: 'Имя должно иметь не более 50 символов', en: 'The name must be at most 50 characters long' },
    'invalidName': {
        ru: 'Имя может содержать только буквы, цифры и символ подчеркивания',
        en: 'A name can only contain letters, numbers, and the underscore character.'
    },
    'confirmRequired': { ru: 'Подтверждение пароля обязательно', en: 'Password confirmation is required' },
    'passwordsMismatch': { ru: 'Пароли не совпадают', en: 'Passwords do not match' },
    'min8Symbols': { ru: 'Минимум 8 символов', en: 'Minimum of 8 characters' },
    'onlyAllowedCharacters': { ru: 'Только разрешенные символы', en: 'Only allowed characters' },
    'onPatternsPage': { ru: 'Перейти на страницу шаблонов', en: 'Go to the patterns page' },
    'typeMismatch': {
        ru: 'Новый тип ячейки не соответствует новому значению',
        en: 'The new cell type does not match the new value'
    },
    'oldNewValueRequired': {
        ru: 'Нужно ввести старое или новое имя ячейки',
        en: 'Please enter the old or new cell name.'
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
    'unknownFormat': { ru: 'Формат не определен', en: 'Format not detected' },
    'unknownFormatDescription': { ru: 'Не удалось определить формат файла. Конвертация может не работать.', en: 'Could not determine file format. Conversion may not work.' },
    'formatRequired': { ru: 'Требуется шаблон', en: 'A pattern is required' },
    'formatRequiredDescription': { ru: 'Исходный и конечный форматы совпадают. Для конвертации необходимо поменять тип.', en: 'The source and destination formats are the same. You need to change the type to convert.' },
    'saveDataError': { ru: 'Не удалось сохранить данные конвертации', en: 'Couldn\'t save conversion data' },
    'conversionDataError': { ru: 'Данные конвертации не найдены. Пожалуйста, начните заново.', en: 'No conversion data found. Please start over.' },
    'deleteError': { ru: 'Не удалось удалить шаблон', en: 'Couldn\'t delete pattern' },
    'exit': { ru: 'Выход', en: 'Exit' },
    'exitDescription': { ru: 'Вы успешно вышли из системы', en: 'You have successfully logged out' },
    'authRequired': { ru: 'Требуется авторизация', en: 'Login required' },
    'authRequiredDescription': { ru: 'Для создания шаблона необходимо войти в систему', en: 'You must be logged in to create a template' },
    'errorModificationLoad': { ru: 'Ошибка загрузки модификаций шаблона', en: 'Error loading pattern modifications' },
    'dataUpdateError': { ru: 'Ошибка обновления данных', en: 'Data update error' },
    'errorReceivingPatterns': { ru: 'Ошибка получения шаблонов', en: 'Error fetching patterns' },
    'authorizationError': { ru: 'Ошибка авторизации', en: 'Authorization error' },
    'errorGetNumberPatterns': { ru: 'Ошибка получения количества шаблонов', en: 'Error getting the number of patterns' },
    'errorGetNumberModifications': { ru: 'Ошибка получения количества модификаций', en: 'Error getting the number of modifications' },
    'tokenNotDefined': { ru: 'Токен не определен', en: 'Token not found' },
    'errorReceivingModifications': { ru: 'Ошибка получения модификаций', en: 'Error fetching modifications' },
    'operationIsBeingPerformed': { ru: 'Выполняется операция', en: 'Operation in progress' },
    'patternCreationError': { ru: 'Ошибка создания шаблона', en: 'Pattern creation error' },
    'patternModificationError': { ru: 'Ошибка изменения шаблона', en: 'Pattern modification error' },
    'patternDeletionError': { ru: 'Ошибка удаления шаблона', en: 'Pattern deletion error' },
    'emailVerification': {
        ru: 'Подтверждение email',
        en: 'Email Verification'
    },
    'verificationInstruction': {
        ru: 'Введите код из письма, отправленного на вашу почту',
        en: 'Enter the code sent to your email'
    },
    'weSentCodeTo': {
        ru: 'Код отправлен на вашу почту',
        en: 'Code sent to your email'
    },
    'verificationCode': {
        ru: 'Код подтверждения',
        en: 'Verification code'
    },
    'codeHint': {
        ru: '6 символов (латиница или цифры)',
        en: '6 characters (letters or numbers)'
    },
    'codeRequired': {
        ru: 'Код обязателен для заполнения',
        en: 'Code is required'
    },
    'codeInvalidFormat': {
        ru: 'Введите 6 символов (латиница или цифры)',
        en: 'Enter 6 characters (letters or numbers)'
    },
    'verify': {
        ru: 'Подтвердить',
        en: 'Verify'
    },
    'resendCode': {
        ru: 'Отправить код повторно',
        en: 'Resend code'
    },
    'invalidCode': {
        ru: 'Неверный код подтверждения. Попробуйте ещё раз.',
        en: 'Invalid verification code. Please try again.'
    },
    'invalidCodeFormat': {
        ru: 'Код должен состоять из 6 символов (латиница или цифры)',
        en: 'Code must be 6 characters (letters or numbers)'
    },
    'emailNotFound': {
        ru: 'Email не найден. Пожалуйста, зарегистрируйтесь заново.',
        en: 'Email not found. Please register again.'
    },
    'verificationCodeResent': {
        ru: 'Новый код подтверждения отправлен на вашу почту',
        en: 'A new verification code has been sent to your email'
    },
    'resendCodeError': {
        ru: 'Не удалось отправить код. Попробуйте позже.',
        en: 'Failed to resend code. Please try again later.'
    },
    'emailVerifiedSuccess': {
        ru: 'Email успешно подтверждён! Вы будете перенаправлены на главную страницу.',
        en: 'Email verified successfully! You will be redirected to the home page.'
    },
    'verificationError': {
        ru: 'Ошибка верификации',
        en: 'Verification error'
    },
    'confirmCancel': {
        ru: 'Подтверждение отмены',
        en: 'Confirm cancellation'
    },
    'confirmCancelMessage': {
        ru: 'Вы уверены, что хотите отменить регистрацию? Ваш аккаунт будет удалён, и все данные будут потеряны.',
        en: 'Are you sure you want to cancel registration? Your account will be deleted and all data will be lost.'
    },
    'registrationCancelled': {
        ru: 'Регистрация отменена',
        en: 'Registration cancelled'
    },
    'userDeletedSuccess': {
        ru: 'Аккаунт успешно удалён. Вы будете перенаправлены на главную страницу.',
        en: 'Account deleted successfully. You will be redirected to the home page.'
    },
    'deleteUserError': {
        ru: 'Не удалось удалить аккаунт. Попробуйте позже.',
        en: 'Failed to delete account. Please try again later.'
    },
    'success': {
        ru: 'Успех',
        en: 'Success'
    },
    'error': {
        ru: 'Ошибка',
        en: 'Error'
    },
    'yes': {
        ru: 'Да',
        en: 'Yes'
    },
    'no': {
        ru: 'Нет',
        en: 'No'
    },
    'resendIn': {
        ru: 'Повторно через',
        en: 'Resend in'
    },
    'seconds': {
        ru: 'сек',
        en: 'sec'
    },
    'userAlreadyExists': { ru: 'Пользователь с таким email уже существует', en: 'User with this email already exists' },
    'emailAlreadyVerified': { ru: 'Электронная почта уже подтверждена', en: 'The email has already been confirmed' },
    'userNotFound': { ru: 'Пользователь не найден', en: 'User was not found' },
    'patternNotFound': { ru: 'Шаблон не найден', en: 'Pattern was not found' },
    'emailConfirmation': { ru: 'Подтверждение email', en: 'Email confirmation' },
    'confirmEmailToWorkWithPatterns': { ru: 'Для работы с шаблонами необходимо подтвердить email', en: 'To work with patterns, you need to confirm your email' },
    // '': { ru: '', en: '' },
    // '': { ru: '', en: '' },
}
