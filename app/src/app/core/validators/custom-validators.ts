import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";


export class CustomValidators {

    private static readonly BAN_PATTERN = /[^\wа-яА-Я_!#$%&\'()*+,\-.\/:;<>=?@\[\]{}^`|~]+/;
    private static readonly NAME_PATTERN = /^[\w_]+$/;
    private static readonly EMAIL_PATTERN = /^[\w_]+[\.\w_]*@([\w_]+\.[\w_]+)$/;
    private static readonly PASSWORD_PATTERN = /^[\wа-яА-Я_!#$%&\'()*+,\-.\/:;<>=?@\[\]{}^`|~]{8,}$/;

    static noBannedCharacters(): ValidatorFn {
        //Проверка на запрещённые символы
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (!value) return null;

            if (CustomValidators.BAN_PATTERN.test(value)) {
                return {
                    BannedCharacters: 'Обнаружены недопустимые символы. Разрешены только буквы, цифры, _ ! # $ % & \' ( ) * + , - . / : ; < = > ? @ [ ] { } ^ ` | ~'
                };
            }

            return null;
        };
    }

    static validateName(): ValidatorFn {
        //Проверка имени
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            
            if (!value) return null;
            
            if (!CustomValidators.NAME_PATTERN.test(value)) {
                return { 
                    invalidName: 'Имя может содержать только буквы, цифры и символ подчеркивания' 
                };
            }
            
            return null;
        };
    }

    static validateEmail(): ValidatorFn {
        //Проверка email
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            
            if (!value) return null;
            
            if (!CustomValidators.EMAIL_PATTERN.test(value)) {
                return { 
                    invalidEmail: 'Введите корректный email (пример: name@domain.com)'
                };
            }
            
            return null;
        };
    }

    static validatePassword(): ValidatorFn {
        //Проверка пароля
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            
            if (!value) return null;
            
            if (value.length < 8) {
                return {
                    invalidLength: 'Пароль должен содержать минимум 8 символов'
                }
            }

            if (!CustomValidators.PASSWORD_PATTERN.test(value)) {
                return { 
                    invalidPassword: 'Пароль содержит недопустимые символы'
                };
            }
            
            return null;
        };
    }

    static noLeadingTrailingSpaces(): ValidatorFn {
        //Проверка на начало или конец с пробела
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;
            
            if (!value) return null;
            
            if (value.startsWith(' ') || value.endsWith(' ')) {
                return { 
                    leadingTrailingSpaces: 'Поле не должно начинаться или заканчиваться пробелом'
                };
            }
            
            return null;
        };
    }

    static passwordsMatch(passwordField: string, confirmPasswordField: string): ValidatorFn {
        //Проверка на совпадение паролей
        return (control: AbstractControl): ValidationErrors | null => {
        const password = control.get(passwordField)?.value;
        const confirmPassword = control.get(confirmPasswordField)?.value;
        
        if (password !== confirmPassword) {
            control.get(confirmPasswordField)?.setErrors({ passwordsMismatch: 'Пароли не совпадают' });
            return { passwordsMismatch: true };
        }
        
            return null;
        };
    }
}