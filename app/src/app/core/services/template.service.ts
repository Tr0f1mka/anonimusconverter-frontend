import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Pattern, NewPattern } from '../models/template.model';
import { APIPathes } from 'src/app/api-pathes';

@Injectable({
    providedIn: 'root'
})
export class TemplateService {
    private apiUrl = APIPathes.templates;

    constructor(private http: HttpClient) {}

    getTemplates(userId: string): Observable<Pattern[]>{
        // Получение шаблонов пользователя
        return this.http.get<Pattern[]>(`${this.apiUrl}/${userId}`).pipe(
            catchError(error => {
                console.error('Error:', error);
                return throwError(() => new Error(error.error?.message || 'Ошибка получения шаблона'));
            })
        );
    }

    createTemplate(pattern: NewPattern): Observable<Pattern>{
        // Создание шаблона
        return this.http.post<Pattern>(this.apiUrl, pattern).pipe(
            catchError(error => {
                console.error('Error:', error);
                return throwError(() => new Error(error.error?.message || 'Ошибка создания шаблона'));
            })
        );
    }

    updateTemplate(pattern: Pattern): Observable<Pattern>{
        // Изменение шаблона
        return this.http.put<Pattern>(this.apiUrl, pattern).pipe(
            catchError(error => {
                console.error('Error:', error);
                return throwError(() => new Error(error.error?.message || 'Ошибка изменения шаблона'));
            })
        );
    }

    deleteTemplate(userId: string, patternId: string): Observable<{status: string, message: string}>{
        // Удаление шаблона
        return this.http.delete<{status: string, message: string}>(`${this.apiUrl}/${userId}/${patternId}`).pipe(
            catchError(error => {
                console.error('Error:', error);
                return throwError(() => new Error(error.error?.message || 'Ошибка удаления шаблона'));
            })
        );
    }

    loadTemplates(): Pattern[] {
        // Заглушка для просмотра
        return [
            {
                id: "1",
                name: "pat1",
                type: "json csv",
                modifications: [
                    {
                        id: "1",
                        old_name: "azaza",
                        new_name: "aboba",
                        new_type: null,
                        new_value: null
                    }
                ]
            },
            {
                id: "1",
                name: "pat2",
                type: "json csv",
                modifications: [
                    {
                        id: "1",
                        old_name: "azaza",
                        new_name: "aboba",
                        new_type: null,
                        new_value: null
                    }
                ]
            },
            {
                id: "1",
                name: "pat3",
                type: "json csv",
                modifications: [
                    {
                        id: "1",
                        old_name: "azaza",
                        new_name: "aboba",
                        new_type: null,
                        new_value: null
                    }
                ]
            },
        ];
    }
}