import { emitDistinctChangesOnlyDefaultValue } from "@angular/compiler";
import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";


export class CustomValidators {

    private static readonly BAN_PATTERN = /[^\wа-яА-Я_!#$%&\'()*+,\-.\/:;<>=?@\[\]{}^`|~]+/;
    private static readonly NAME_PATTERN = /^[\w_]+$/;
    private static readonly EMAIL_PATTERN = /^[\w_]+[\.\w_]*@([\w_]+\.[\w_]+)$/;
    private static readonly PASSWORD_PATTERN = /^[\wа-яА-Я_!#$%&\'()*+,\-.\/:;<>=?@\[\]{}^`|~]{8,}$/;
    private static readonly BOOL_PATTERN = /^((1)|(0)|(true)|(false)|(True)|(False))$/;
    private static readonly INT_PATTERN = /^[+|-]?\d+$/;
    private static readonly FLOAT_PATTERN = /^[+|-]?\d+(.\d+)?$/;

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

            if (value.length > 30) {
                return {
                    OverLength: 'Ввод должен иметь длину не более 30 символов'
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

    static minModificationsLength(group: FormGroup): ValidationErrors | null {
        const modifications = group.get('modifications') as FormArray;
        return modifications && modifications.length === 0 ? { requiredModifications: true } : null;
    }

    static setNull(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value === '') {
                control.setValue(null, { emitEvent: false });
            }
            return null;
        }
    }

    static oldNewValue(control: AbstractControl): ValidationErrors | null {
        const old_name = control.get('old_name')?.value;
        const new_name = control.get('new_name')?.value;

        if (old_name === null && new_name === null) {
            return { nameMismatch: true };
        }

        return null;
    }

    static requiredArgument(control: AbstractControl): ValidationErrors | null {
        const old_name = control.get('old_name')?.value;
        const new_name = control.get('new_name')?.value;
        const new_type = control.get('new_type')?.value;
        const new_value = control.get('new_value')?.value;
        
        if (old_name !== null) {
            if (!(new_name || new_type || new_value)) {
                return { requiredArgument: true };
            }
        }
        return null;
    }

    static setTypeValue(): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            if (control.value === 'null') {
                control.setValue(null);
            }
            return null;
        }
    }

    static defaultValueType(control: AbstractControl): ValidationErrors | null {
        const new_type = control.get('new_type')?.value;
        const new_value = control.get('new_value')?.value;

        if (new_type === null || new_value === null) {
            return null;
        }

        if (new_type === "Boolean") {
            if (!CustomValidators.BOOL_PATTERN.test(new_value)) {
                return { typeMismatch: true };
            }
        }
        else if (new_type === "Integer") {
            if (!CustomValidators.INT_PATTERN.test(new_value)) {
                return { typeMismatch: true };
            }
        }
        else if (new_type === "Float") {
            if (!CustomValidators.FLOAT_PATTERN.test(new_value)) {
                return { typeMismatch: true };
            }
        }

        return null;
    }
}