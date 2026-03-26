import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../../../core/services/language.service';
import { ModalService } from '../../../../core/services/modal.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrl: 'header.component.css'
})
export class HeaderComponent implements OnInit {
    isLoggedIn = false;
    currentUser: User | null = null;
    showUserMenu = false;

    constructor(
        private router: Router,
        private languageService: LanguageService,
        private modalService: ModalService,
        private authService: AuthService
    ) {}

    ngOnInit(): void {
        this.authService.isLoggedIn().subscribe(isLoggedIn => {
            this.isLoggedIn = isLoggedIn;
        });

        this.authService.getCurrentUser().subscribe(user => {
            this.currentUser = user;
            console.log(user?.name);
            console.log(user?.email);
        });
    }

    navigateToHome(): void {
        this.router.navigate(['/']);
    }

    toggleUserMenu(): void {
        this.showUserMenu = !this.showUserMenu;
    }

    logout(): void {
        this.authService.logout();
        this.showUserMenu = false;
        this.router.navigate(['/']);
        
        this.modalService.open({
            id: 'logout-success',
            title: 'Выход',
            content: ['Вы успешно вышли из системы'],
            type: 'info',
            size: 'small'
        });
    }

    showHelpModal(): void {
        this.modalService.open({
            id: 'help-modal',
            title: this.languageService.translate('helpTitle'),
            content: [
                this.languageService.translate('helpContent1'),
                this.languageService.translate('helpContent2')
            ],
            type: 'help',
            size: 'medium'
        });
    }

    showDevModal(): void {
        this.modalService.open({
            id: 'dev-modal',
            title: this.languageService.translate('devTitle'),
            content: [
                `${this.languageService.translate('apiEndpoint')} API нужно вставить`,
                `${this.languageService.translate('documentation')} /docs`,
                `${this.languageService.translate('github')} GIT нужно вставить`
            ],
            type: 'dev',
            size: 'medium'
        });
    }
}