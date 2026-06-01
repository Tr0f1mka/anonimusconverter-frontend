import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalService } from '../../../../core/services/modal.service';
import { CustomValidators } from '../../../../core/validators/custom-validators';
import { LanguageService } from 'src/app/core/services/language.service';

@Component({
    selector: 'app-login-page',
    templateUrl: 'login-page.component.html',
    styleUrl: 'login-page.component.css'
})
export class LoginPageComponent {
    isRegisterMode = false;
    isLoading = false;
    
    loginForm: FormGroup;
    registerForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private modalService: ModalService,
        private languageService: LanguageService,
        private router: Router
    ) {
        // Форма входа
        this.loginForm = this.fb.group({
            email: ['', [
                Validators.required,
                CustomValidators.validateEmail()
            ]],
            password: ['', [
                Validators.required,
                CustomValidators.validatePassword()
            ]]
        });

        // Форма регистрации
        this.registerForm = this.fb.group({
            username: ['', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
                CustomValidators.validateName()
            ]],
            email: ['', [
                Validators.required,
                CustomValidators.validateEmail()
            ]],
            password: ['', [
                Validators.required,
                CustomValidators.validatePassword()
            ]],
            confirmPassword: ['', Validators.required]
        }, {
            validators: CustomValidators.passwordsMatch('password', 'confirmPassword')
        });
    }

    // get hasBannedChars(): boolean {
    //     const password = this.registerForm.get('password')?.value || '';
    //     return CustomValidators['BAN_PATTERN'].test(password);
    // }

    setMode(isRegister: boolean): void {
        this.isRegisterMode = isRegister;
        this.loginForm.reset();
        this.registerForm.reset();
    }

    isFieldInvalid(form: FormGroup, fieldName: string): boolean {
        const field = form.get(fieldName);
        return field ? field.invalid && field.touched : false;
    }

    onLogin(): void {
        if (this.loginForm.valid) {
            this.isLoading = true;
            
            this.authService.login(this.loginForm.value).subscribe({
                next: () => {
                    this.isLoading = false;
                    this.router.navigate(['/']);
                },
                error: (error) => {
                    this.isLoading = false;
                    this.modalService.open({
                        id: 'login-error',
                        title: this.languageService.translate('errorTitle'),
                        content: [(error.status !== 400)? this.languageService.translate('authorizationError') : this.languageService.translate('invalidEmailOrPassword')],
                        type: 'warning',
                        size: 'small'
                    });
                }
            });
        }
    }

    onRegister(): void {
        if (this.registerForm.valid) {
            this.isLoading = true;
            
            const { confirmPassword, ...registerData } = this.registerForm.value;
            console.log(registerData);
            this.authService.register(registerData).subscribe({
                next: () => {
                    this.isLoading = false;
                    // this.modalService.open({
                    //     id: 'register-success',
                    //     title: 'Успех',
                    //     content: ['Регистрация прошла успешно! Теперь вы можете войти'],
                    //     type: 'info',
                    //     size: 'small'
                    // });
                    this.setMode(false);
                    this.router.navigate(['/verify/email']);
                },
                error: (error) => {
                    this.isLoading = false;
                    this.modalService.open({
                        id: 'register-error',
                        title: this.languageService.translate('errorTitle'),
                        content: [(error.message === 'EMAIL EXISTS') ? this.languageService.translate('userAlreadyExists') : this.languageService.translate('failedRegister')],
                        type: 'warning',
                        size: 'small'
                    });
                }
            });
        }
    }
}