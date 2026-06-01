import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../../../core/services/language.service';
import { ModalService } from '../../../../core/services/modal.service';
import { AuthService } from '../../../../core/services/auth.service';
import { User } from '../../../../core/models/user.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-header',
    templateUrl: 'header.component.html',
    styleUrl: 'header.component.css'
})
export class HeaderComponent implements OnInit {
    isLoggedIn = false;
    currentUser: User | null = null;
    showUserMenu = false;
    subscriptions: Subscription[] = [];

    constructor(
        private router: Router,
        private languageService: LanguageService,
        private modalService: ModalService,
        private authService: AuthService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.authService.getCurrentUser().subscribe(user => {
                this.currentUser = user;
                this.cdr.detectChanges();
            })
        );
        this.subscriptions.push(
            this.authService.isLoggedIn().subscribe(isLoggedIn => {
                this.isLoggedIn = isLoggedIn;
                this.cdr.detectChanges();
            })
        );
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    navigateToHome(): void {
        this.router.navigate(['/']);
    }

    toggleUserMenu(): void {
        this.showUserMenu = !this.showUserMenu;
    }

    toVerified(): void {
        // console.log('azaza');
        this.router.navigate(['/verify/email']);
        this.showUserMenu = false;
    }

    logout(): void {
        this.authService.logout();
        this.showUserMenu = false;
        this.router.navigate(['/']);
        
        this.modalService.open({
            id: 'logout-success',
            title: this.languageService.translate('success'),
            content: [this.languageService.translate('exitDescription')],
            type: 'info',
            size: 'small'
        });
    }
}