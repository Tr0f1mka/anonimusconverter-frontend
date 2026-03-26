import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest, AuthResponse, BackendAuthResponse } from '../models/user.model';
import { APIPathes } from 'src/app/api-pathes';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = APIPathes.auth;
    private currentUser = new BehaviorSubject<User | null>(null);
    private isAuthenticated = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        this.checkAuthStatus();
    }

    private checkAuthStatus(): void {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            try {
                const user = JSON.parse(userData);
                this.currentUser.next(user);
                this.isAuthenticated.next(true);
            } catch (e) {
                this.logout();
            }
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

    getCurrentUserSync(): User | null {
        return this.currentUser.value;
    }

    private transformBackendResponse(response: BackendAuthResponse): AuthResponse {
        return {
            user: {
                id: response.userId,
                name: response.username,
                email: response.email
            },
            token: response.token
        };
    }

    // Регистрация
    register(data: RegisterRequest): Observable<AuthResponse> {
        // Реальный запрос к API
        
        return this.http.post<BackendAuthResponse>(`${this.apiUrl}/registration`, data).pipe(
            map(response => {
                const correct_response = this.transformBackendResponse(response);
                console.log("USER RESPONSE", correct_response);
                return correct_response;
            }),
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    // Вход
    login(data: LoginRequest): Observable<AuthResponse> {
        // Реальный запрос к API
        
        return this.http.post<BackendAuthResponse>(`${this.apiUrl}/login`, data).pipe(
            map(response => {
                const correct_response = this.transformBackendResponse(response);
                this.setSession(correct_response);
                console.log("USER RESPONSE", correct_response);
                return correct_response;
            }),
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    private setSession(response: AuthResponse): void {
        // Преобразуем Date в строку для localStorage если нужно
        console.log("SET SESSION: ", response);
        const userForStorage = {
          ...response.user
        };
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(userForStorage));
        
        // Для текущего пользователя в приложении оставляем как есть
        this.currentUser.next(response.user);
        this.isAuthenticated.next(true);
    }

    logout(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.currentUser.next(null);
        this.isAuthenticated.next(false);
        this.http.delete(this.apiUrl);
    }
}