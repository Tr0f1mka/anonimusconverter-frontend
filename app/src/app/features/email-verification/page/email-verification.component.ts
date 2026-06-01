import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, interval, takeUntil } from 'rxjs';
import { VerificationService } from 'src/app/core/services/verification.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { LanguageService } from 'src/app/core/services/language.service';

@Component({
    selector: 'app-email-verification',
    templateUrl: './email-verification.component.html',
    styleUrls: ['./email-verification.component.css']
})
export class EmailVerificationComponent implements OnInit, OnDestroy {
    verificationForm: FormGroup;
    isLoading: boolean = false;
    isResending: boolean = false;
    resendCooldown: number = 0;
    
    private destroy$ = new Subject<void>();
    private cooldownInterval: any;

    constructor(
        private fb: FormBuilder,
        private verificationService: VerificationService,
        private authService: AuthService,
        private modalService: ModalService,
        private languageService: LanguageService,
        private router: Router
    ) {
        this.verificationForm = this.fb.group({
            code: ['', [
                Validators.required,
                Validators.pattern(/^[A-Za-z0-9]{6}$/)
            ]]
        });
    }

    ngOnInit(): void {
        // Проверяем, не верифицирован ли уже пользователь
        const currentUser = this.authService.getCurrentUserSync();
        if (currentUser?.isVerified) {
            this.router.navigate(['/']);
            return;
        }
        
        // Автоматически отправляем код при заходе на страницу
        this.sendInitialCode();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.cooldownInterval) {
            clearInterval(this.cooldownInterval);
        }
    }

    private sendInitialCode(): void {
        this.isResending = true;
        
        this.verificationService.resendCode()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.isResending = false;
                    this.startResendCooldown();
                },
                error: (error) => {
                    this.isResending = false;
                    this.showError('resendCodeError');
                }
            });
    }

    // Автоматический перевод в верхний регистр
    onCodeInput(event: any): void {
        let value = event.target.value.toUpperCase();
        value = value.replace(/[^A-Z0-9]/g, '');
        if (value.length > 6) {
            value = value.slice(0, 6);
        }
        this.verificationForm.get('code')?.setValue(value, { emitEvent: false });
    }

    // Подтверждение кода
    onSubmit(): void {
        if (this.verificationForm.invalid) {
            this.showError('invalidCodeFormat');
            return;
        }

        this.isLoading = true;
        const code = this.verificationForm.get('code')?.value;

        this.verificationService.verifyCode(code)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.isLoading = false;
                    
                    // Обновляем статус верификации в сервисе авторизации
                    this.authService.verified();
                    
                    this.modalService.open({
                        id: 'verification-success',
                        title: this.languageService.translate('success'),
                        content: [this.languageService.translate('emailVerifiedSuccess')],
                        type: 'info',
                        size: 'small'
                    });
                    
                    this.router.navigate(['/']);
                },
                error: (error) => {
                    this.isLoading = false;
                    
                    let errorKey = 'invalidCode';
                    if (error.error?.message === 'EMAIL ALREADY VERIFIED') {
                        errorKey = 'emailAlreadyVerified';
                        // Если уже верифицирован, перенаправляем
                        this.router.navigate(['/']);
                    }
                    
                    this.showError(errorKey);
                }
            });
    }

    // Запрос нового кода
    resendCode(): void {
        if (this.resendCooldown > 0 || this.isResending) {
            return;
        }
        
        this.isResending = true;
        
        this.verificationService.resendCode()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.isResending = false;
                    this.startResendCooldown();
                    
                    this.modalService.open({
                        id: 'code-resent',
                        title: this.languageService.translate('success'),
                        content: [this.languageService.translate('verificationCodeResent')],
                        type: 'info',
                        size: 'small'
                    });
                },
                error: (error) => {
                    this.isResending = false;
                    this.showError('resendCodeError');
                }
            });
    }

    private startResendCooldown(): void {
        this.resendCooldown = 60;
        this.cooldownInterval = setInterval(() => {
            if (this.resendCooldown > 0) {
                this.resendCooldown--;
            } else {
                clearInterval(this.cooldownInterval);
            }
        }, 1000);
    }

    private showError(translationKey: string): void {
        this.modalService.open({
            id: 'verification-error',
            title: this.languageService.translate('error'),
            content: [this.languageService.translate(translationKey)],
            type: 'warning',
            size: 'small'
        });
    }

    cancelVerification(): void {
        this.router.navigate(['/']);
    }
}



// import { Component, OnInit, OnDestroy } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router, ActivatedRoute } from '@angular/router';
// import { VerificationService } from 'src/app/core/services/verification.service';
// import { AuthService } from 'src/app/core/services/auth.service';
// import { ModalService } from 'src/app/core/services/modal.service';
// import { LanguageService } from 'src/app/core/services/language.service';
// import { Subject, timer } from 'rxjs';
// import { User } from 'src/app/core/models/user.model';

// @Component({
//     selector: 'app-email-verification',
//     templateUrl: './email-verification.component.html',
//     styleUrls: ['./email-verification.component.css']
// })
// export class EmailVerificationComponent implements OnInit, OnDestroy {
//     verificationForm: FormGroup;
//     isLoading: boolean = false;
//     isResending: boolean = false;
//     isDeleting: boolean = false;
//     resendCooldown: number = 0; // секунды до повторной отправки
//     user: User | null = null;
    
//     private destroy$ = new Subject<void>();
//     private cooldownTimer: any;

//     constructor(
//         private fb: FormBuilder,
//         private verificationService: VerificationService,
//         private authService: AuthService,
//         private modalService: ModalService,
//         private languageService: LanguageService,
//         private router: Router
//     ) {
//         this.verificationForm = this.fb.group({
//             code: ['', [
//                 Validators.required,
//                 Validators.pattern(/^[A-Za-z0-9]{6}$/)
//             ]]
//         });
//     }

//     ngOnInit(): void {
//         this.isResending = true;
        
//         this.verificationService.resendCode().subscribe({
//             next: () => {
//                 this.isResending = false;
//             },
//             error: (error) => {
//                 this.isResending = false;
//                 this.modalService.open({
//                     id: 'resend-error',
//                     title: this.languageService.translate('error'),
//                     content: [this.languageService.translate('resendCodeError')],
//                     type: 'warning',
//                     size: 'small'
//                 });
//             }
//         });
//     }

//     ngOnDestroy(): void {
//         this.destroy$.next();
//         this.destroy$.complete();
//         if (this.cooldownTimer) {
//             clearInterval(this.cooldownTimer);
//         }
//     }

//     // Автоматический перевод в верхний регистр
//     onCodeInput(event: any): void {
//         let value = event.target.value.toUpperCase();
//         value = value.replace(/[^A-Z0-9]/g, ''); // Только буквы и цифры
//         if (value.length > 6) {
//             value = value.slice(0, 6);
//         }
//         this.verificationForm.get('code')?.setValue(value, { emitEvent: false });
//     }

//     // Подтверждение кода
//     onSubmit(): void {
//         if (this.verificationForm.invalid) {
//             this.modalService.open({
//                 id: 'invalid-code',
//                 title: this.languageService.translate('error'),
//                 content: [this.languageService.translate('invalidCodeFormat')],
//                 type: 'warning',
//                 size: 'small'
//             });
//             return;
//         }

//         this.isLoading = true;
//         const code = this.verificationForm.get('code')?.value;

//         this.verificationService.verifyCode(code).subscribe({
//             next: (response) => {
//                 this.isLoading = false;
                
//                 // Сохраняем данные пользователя
//                 // this.authService.setSession();

//                 this.authService.verified();
                
//                 this.modalService.open({
//                     id: 'verification-success',
//                     title: this.languageService.translate('success'),
//                     content: [this.languageService.translate('emailVerifiedSuccess')],
//                     type: 'info',
//                     size: 'small'
//                 });
//                 this.router.navigate(['/']);
//             },
//             error: (error) => {
//                 this.isLoading = false;
//                 this.modalService.open({
//                     id: 'verification-error',
//                     title: this.languageService.translate('error'),
//                     content: [(error.error?.message === 'EMAIL ALREADY VERIFIED') ? this.languageService.translate('emailAlreadyVerified') : this.languageService.translate('invalidCode')],
//                     type: 'warning',
//                     size: 'small'
//                 });
//             }
//         });
//     }

//     // Запрос нового кода
//     resendCode(): void {
//         if (this.resendCooldown > 0) {
//             return;
//         }
        
//         this.isResending = true;
        
//         this.verificationService.resendCode().subscribe({
//             next: () => {
//                 this.isResending = false;
//                 this.startResendCooldown();
//             },
//             error: (error) => {
//                 this.isResending = false;
//                 this.modalService.open({
//                     id: 'resend-error',
//                     title: this.languageService.translate('error'),
//                     content: [this.languageService.translate('resendCodeError')],
//                     type: 'warning',
//                     size: 'small'
//                 });
//             }
//         });
//     }

//     private startResendCooldown(): void {
//         this.resendCooldown = 60; // 60 секунд
//         this.cooldownTimer = setInterval(() => {
//             if (this.resendCooldown > 0) {
//                 this.resendCooldown--;
//             } else {
//                 clearInterval(this.cooldownTimer);
//             }
//         }, 1000);
//     }

//     cancelVerification(): void {
//         this.router.navigate(['/']);
//     }
// }