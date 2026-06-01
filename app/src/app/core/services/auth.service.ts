import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, delay, tap } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest, AuthResponse, BackendAuthResponse } from '../models/user.model';
import { APIPathes } from 'src/app/api-pathes';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private URL = APIPathes.API;
    private currentUser = new BehaviorSubject<User | null>(null);
    private isAuthenticated = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient) {
        this.checkAuthStatus();
    }

    private checkAuthStatus(): void {
        this.http.post<BackendAuthResponse>(`${this.URL}/auth`, {email: null, password: null}, { withCredentials: true }).subscribe({
            next: (response) => {
                this.currentUser.next(this.transformLoginResponse(response));
                this.isAuthenticated.next(true);
            },
            error: (error) => {
                console.log(error);
            }
        });
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

    // setSession(): void {
    //     try {
    //         const user = JSON.parse(localStorage.getItem('user') || '');
    //         this.currentUser.next(user);
    //         this.isAuthenticated.next(true);
    //     }
    //     catch (e) {
    //         this.logout();
    //     }
    // }

    verified(): void {
        let user = this.getCurrentUserSync();
        if (user) {
            user.isVerified = true;
            this.currentUser.next(user);
        }
    }

    // Регистрация
    register(data: RegisterRequest): Observable<BackendAuthResponse> {
        // Реальный запрос к API
        
        return this.http.post<BackendAuthResponse>(`${this.URL}/users`, data, { withCredentials: true }).pipe(
            tap(response => {
                this.currentUser.next(this.transformLoginResponse(response));
                this.isAuthenticated.next(true);
            }),
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    private transformLoginResponse(response: BackendAuthResponse): User {
        return {
            id: response.userId,
            name: response.username,
            email: response.email,
            isVerified: response.isVerified
        }
    }

    // Вход
    login(data: LoginRequest): Observable<BackendAuthResponse> {
        // Реальный запрос к API
        
        return this.http.post<BackendAuthResponse>(`${this.URL}/auth`, data, { withCredentials: true }).pipe(
            tap(response => {
                this.currentUser.next(this.transformLoginResponse(response));
                this.isAuthenticated.next(true);
            }),
            catchError(error => {
                return throwError(() => new Error(error.error?.message));
            })
        );
    }

    logout(): void {
        this.http.delete(`${this.URL}/auth`, { withCredentials: true }).subscribe(() => {
            this.currentUser.next(null);
            this.isAuthenticated.next(false);
        });
    }
}
