import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface User {
    id: string;
    name: string;
    email: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUser = new BehaviorSubject<User | null>(null);
    private isAuthenticated = new BehaviorSubject<boolean>(false);

    constructor() {
        // Проверяем наличие токена при инициализации
        this.checkAuthStatus();
    }

    private checkAuthStatus(): void {
        const token = localStorage.getItem('token');
        if (token) {
            // Здесь будет запрос к API для получения данных пользователя
            // Пока используем заглушку
            this.isAuthenticated.next(true);
            this.currentUser.next({
                id: '1',
                name: 'Тестовый пользователь',
                email: 'user@example.com'
            });
        }
    }

    getCurrentUser(): Observable<User | null> {
        return this.currentUser.asObservable();
    }

    isLoggedIn(): Observable<boolean> {
        return this.isAuthenticated.asObservable();
    }

    isLoggedInSync(): boolean {
        return this.isAuthenticated.value;
    }

    login(email: string, password: string): Observable<boolean> {
        // Здесь будет реальный запрос к API
        return of(true);
    }

    logout(): void {
        localStorage.removeItem('token');
        this.isAuthenticated.next(false);
        this.currentUser.next(null);
    }
}