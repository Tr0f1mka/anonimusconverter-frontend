import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalService } from '../../../../core/services/modal.service';
import { CustomValidators } from '../../../../core/validators/custom-validators';

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
        private router: Router
    ) {
        // Форма входа
        this.loginForm = this.fb.group({
          email: ['', [
            Validators.required,
            CustomValidators.validateEmail(),
            CustomValidators.noBannedCharacters()
          ]],
          password: ['', [
            Validators.required,
            CustomValidators.validatePassword()
          ]]
        });

        // Форма регистрации
        this.registerForm = this.fb.group({
            name: ['', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
                CustomValidators.validateName(),
                CustomValidators.noBannedCharacters(),
                CustomValidators.noLeadingTrailingSpaces()
            ]],
            email: ['', [
                Validators.required,
                CustomValidators.validateEmail(),
                CustomValidators.noBannedCharacters()
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

    get hasBannedChars(): boolean {
        const password = this.registerForm.get('password')?.value || '';
        return CustomValidators['BAN_PATTERN'].test(password);
    }

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
                    this.modalService.open({
                        id: 'login-success',
                        title: 'Успех',
                        content: ['Вы успешно вошли в систему'],
                        type: 'info',
                        size: 'small'
                    });
                    this.router.navigate(['/']);
                },
                error: (error) => {
                    this.isLoading = false;
                    this.modalService.open({
                        id: 'login-error',
                        title: 'Ошибка',
                        content: [error.message || 'Неверный email или пароль'],
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
        
        this.authService.register(registerData).subscribe({
          next: () => {
            this.isLoading = false;
            this.modalService.open({
              id: 'register-success',
              title: 'Успех',
              content: ['Регистрация прошла успешно! Теперь вы можете войти'],
              type: 'info',
              size: 'small'
            });
            this.setMode(false);
          },
          error: (error) => {
            this.isLoading = false;
            this.modalService.open({
              id: 'register-error',
              title: 'Ошибка',
              content: [error.message || 'Не удалось зарегистрироваться'],
              type: 'warning',
              size: 'small'
            });
          }
        });
      }
    }

    forgotPassword(event: Event): void {
      event.preventDefault();
      this.modalService.open({
        id: 'forgot-password',
        title: 'Восстановление пароля',
        content: ['Функция восстановления пароля будет доступна позже'],
        type: 'info',
        size: 'small'
      });
    }
}