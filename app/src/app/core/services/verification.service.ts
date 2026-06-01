import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APIPathes } from 'src/app/api-pathes';

@Injectable({
    providedIn: 'root'
})
export class VerificationService {
    private apiUrl = APIPathes.API;

    constructor(private http: HttpClient) {}

    // Подтверждение кода
    verifyCode(code: string): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/auth/email/verification`, code, { 
            headers: new HttpHeaders({
                'Content-Type': 'text/plain'
            }),
            withCredentials: true });
    }

    // Запрос нового кода
    resendCode(): Observable<void> {
        return this.http.post<void>(`${this.apiUrl}/auth/email/resending`, null, { withCredentials: true });
    }
}