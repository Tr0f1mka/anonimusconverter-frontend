import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, catchError, delay } from 'rxjs/operators';
import { User, LoginRequest, RegisterRequest, AuthResponse } from '../models/user.model';
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
        // Преобразуем строку даты обратно в Date объект если нужно
        if (user.createdAt) {
          user.createdAt = new Date(user.createdAt);
        }
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

  // Регистрация
  register(data: RegisterRequest): Observable<AuthResponse> {
    // Реальный запрос к API
    /*
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, data).pipe(
      map(response => {
        this.setSession(response);
        return response;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
    */
    
    // Заглушка для демонстрации
    const response: AuthResponse = {
      user: {
        id: Math.random().toString(36).substring(7),
        name: data.name,
        email: data.email,
        createdAt: new Date().toISOString() // Отправляем как строку ISO
      },
      token: 'dummy-token-' + Math.random().toString(36).substring(7)
    };
    
    return of(response).pipe(
      delay(1000),
      map(response => {
        this.setSession(response);
        return response;
      }),
      catchError(error => {
        return throwError(() => new Error('Ошибка регистрации'));
      })
    );
  }

  // Вход
  login(data: LoginRequest): Observable<AuthResponse> {
    // Реальный запрос к API
    /*
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      map(response => {
        this.setSession(response);
        return response;
      }),
      catchError(error => {
        return throwError(() => error);
      })
    );
    */
    
    // Заглушка для демонстрации
    const response: AuthResponse = {
      user: {
        id: '1',
        name: 'Тестовый пользователь',
        email: data.email,
        createdAt: new Date().toISOString() // Отправляем как строку ISO
      },
      token: 'dummy-token-' + Math.random().toString(36).substring(7)
    };
    
    return of(response).pipe(
      delay(1000),
      map(response => {
        this.setSession(response);
        return response;
      }),
      catchError(error => {
        return throwError(() => new Error('Неверный email или пароль'));
      })
    );
  }

  private setSession(response: AuthResponse): void {
    // Преобразуем Date в строку для localStorage если нужно
    const userForStorage = {
      ...response.user,
      createdAt: response.user.createdAt instanceof Date 
        ? response.user.createdAt.toISOString() 
        : response.user.createdAt
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
  }
}