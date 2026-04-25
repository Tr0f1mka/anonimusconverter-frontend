import { group } from "@angular/animations";
import { emitDistinctChangesOnlyDefaultValue } from "@angular/compiler";
import { AbstractControl, FormArray, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { LanguageService } from "../services/language.service";

export class CustomValidators {

    private static readonly BAN_PATTERN = /[^\wа-яА-Я_!#$%&\'()*+,\-.\/:;<>=?@\[\]{}^`|~]+/;
    private static readonly NAME_PATTERN = /^[\w_]+$/;
    private static readonly EMAIL_PATTERN = /^[\w_]+[\.\w_]*@([\w_]+\.[\w_]+)$/;
    private static readonly PASSWORD_PATTERN = /^[\wа-яА-Я_!#$%&\'()*+,\-.\/:;<>=?@\[\]{}^`|~]{8,}$/;
    private static readonly BOOL_PATTERN = /^((1)|(0)|(true)|(false)|(True)|(False))$/;
    private static readonly INT_PATTERN = /^[+|-]?\d+$/;
    private static readonly FLOAT_PATTERN = /^[+|-]?\d+(.\d+)?$/;

    constructor(
        private languageService: LanguageService
    ) {}

    static noBannedCharacters(): ValidatorFn {
        //Проверка на запрещённые символы
        return (control: AbstractControl): ValidationErrors | null => {
            const value = control.value;

            if (!value) return null;

            if (CustomValidators.BAN_PATTERN.test(value)) {
                return {
                    BannedCharacters: true
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
                    invalidName: true
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
                    invalidEmail: true
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
                    invalidLength: true
                }
            }

            if (!CustomValidators.PASSWORD_PATTERN.test(value)) {
                return { 
                    invalidPassword: true
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

    static setNull(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value === '') {
                control.setValue(null, { emitEvent: false });
            }
            return null;
        }
    }



    static oldNewValue(): ValidationErrors | null {
        return ((control: AbstractControl) => {
            const old_name = control.get('oldName')?.value;
            const new_name = control.get('newName')?.value;

            if (old_name === null && new_name === null) {
                return { oldNewValueRequired: true };
            }

            return null;
        });
    }

    static requiredArgument(): ValidationErrors | null {
        return (control: AbstractControl): ValidationErrors | null => {
            const new_name = control.get('newName')?.value;
            const new_type = control.get('newType')?.value;
            const new_value = control.get('newValue')?.value;
            if (!(new_name || new_type || new_value)) {
                return { requiredArgument: true }
            }
            return null;
        }
    }

    static minModificationsLength(): ValidationErrors | null {
        return (control: AbstractControl): ValidationErrors | null => {
            const array = control as FormArray;
            if (!array || !array.controls.length) return { minModificationsLength: true };
            return null;
        }
    }

    static setTypeValue(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (control.value === 'null') {
                control.setValue(null, { emitEvent: false });
            }
            return null;
        };
    }

    static defaultValueType(): ValidationErrors | null {
        return ((control: AbstractControl) => {
            const new_type = control.get('newType')?.value;
            const new_value = control.get('newValue')?.value;

            if (new_type === null || new_value === null) {
                return null;
            }

            if (new_type === "Boolean") {
                if (!CustomValidators.BOOL_PATTERN.test(new_value)) {
                    return { typeMismatch: { expected: 'Boolean', value: new_value } };
                }
            }
            else if (new_type === "Integer") {
                if (!CustomValidators.INT_PATTERN.test(new_value)) {
                    return { typeMismatch: { expected: 'Integer', value: new_value } };
                }
            }
            else if (new_type === "Float") {
                if (!CustomValidators.FLOAT_PATTERN.test(new_value)) {
                    return { typeMismatch: { expected: 'Float', value: new_value } };
                }
            }

            return null;
        });
    }
}