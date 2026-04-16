import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, throwError, tap, findIndex, delay } from 'rxjs';
import { Pattern, NewPattern, UpdetePattern, Modification } from '../models/pattern.model';
import { APIPathes } from 'src/app/api-pathes';
import { AuthService } from './auth.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PatternService {
    private apiUrl = APIPathes.patterns;
    private apiModifications = APIPathes.modifications;

    private pattern_storage = new BehaviorSubject<Pattern[]|null>(null);
    public patterns$ = this.pattern_storage.asObservable();

    private current_user_id: string | null = null;


    constructor(
        private http: HttpClient,
        private auth_service: AuthService
    ) {
        this.auth_service.getCurrentUser().subscribe(user => {
            if (user) {
                this.current_user_id = user.id;
                this.loadPatternsFromService();
            }
            else {
                this.current_user_id = null;
                this.clearStorage();
            }
        });
    }


    loadPatternsFromService(): void {
        if (!this.current_user_id) return;

        this.getPatterns(100, 1).subscribe({
            next: (patterns) => {
                this.pattern_storage.next(patterns);
            },
            error: (error) => {
                console.error('Failed to load patterns', error);
                this.pattern_storage.next([]);
            }
        })
    }


    clearStorage() {
        this.pattern_storage.next([]);
    }


    getPatterns(limit: number, offset: number): Observable<Pattern[]>{
        // Получение шаблонов пользователя        
        return this.http.get<Pattern[]>(`${this.apiUrl}/${this.current_user_id}/${limit}/${offset}`).pipe(
            catchError(error => {
                console.error('Error:', error);
                return throwError(() => new Error(error.error?.message || 'Ошибка получения шаблонов'));
            })
        );
        // return of(this.stub()).pipe(delay(3));
    }


    getModifications(patternId: string, limit: number, offset: number): Observable<Modification[]>{
        return this.http.get<Modification[]>(`${this.apiModifications}/${patternId}/${limit}/${offset}`).pipe(
            catchError(error => {
                console.error("Error", error);
                return throwError(() => new Error(error.error?.message || 'Ошибка получения модификаций'));
            })
        );
    }


    createPattern(pattern: NewPattern): Observable<Pattern>{
        // Создание шаблона
        if (this.current_user_id) {
            pattern.userId = this.current_user_id;
        }
        // console.log(pattern);
        return this.http.post<Pattern>(this.apiUrl, pattern).pipe(
            tap((new_pattern) => {
                const old_patterns = this.pattern_storage.value;
                if (old_patterns) {
                    this.pattern_storage.next([...old_patterns, new_pattern]);
                }
                else {
                    this.pattern_storage.next([new_pattern]);
                }
            }),
            catchError(error => {
                console.error('Error:', error);
                return throwError(() => new Error(error.error?.message || 'Ошибка создания шаблона'));
            })
        );
    }


    updatePattern(pattern: UpdetePattern): Observable<Pattern>{
        // Изменение шаблона
        return this.http.put<Pattern>(this.apiUrl, pattern).pipe(
            tap((update_pattern) => {
                const old_patterns = this.pattern_storage.value;
                if (old_patterns) {
                    const ind = old_patterns.findIndex(p => p.id === update_pattern.id);
                    if (ind !== -1) {
                        const old_patterns_list = [...old_patterns];
                        old_patterns_list[ind] = update_pattern;
                        this.pattern_storage.next(old_patterns_list);
                    }
                }
            }),
            catchError(error => {
                console.error('Error:', error);
                return throwError(() => new Error(error.error?.message || 'Ошибка изменения шаблона'));
            })
        );
    }


    deletePattern(patternId: string): Observable<{status: string, message: string}>{
        // Удаление шаблона
        return this.http.delete<{status: string, message: string}>(`${this.apiUrl}/${patternId}`).pipe(
            tap(() =>{
                const patterns = this.pattern_storage.value;
                if (patterns) {
                    this.pattern_storage.next(patterns.filter(p => p.id !== patternId));
                }
            }),
            catchError(error => {
                console.error('Error:', error);
                return throwError(() => new Error(error.error?.message || 'Ошибка удаления шаблона'));
            })
        );
    }

    getPatternById(id: string): Pattern | null {
        //Взятие шаблона по id
        const patterns = this.pattern_storage.value;
        if (patterns) {
            return patterns.find(p => p.id === id) || null;
        }
        return null;
    }

    getAllPatterns(): Pattern[] {
        //Взятие всех шаблонов
        return this.pattern_storage.value || [];
    }

    refreshStorage(): void {
        //Принудительное обновление
        if (this.current_user_id) {
            this.loadPatternsFromService();
        }
    }

    stub(): Pattern[] {
        // return [];
        return [
            {
                id: "1",
                name: "pat1"
            },
            {
                id: "2",
                name: "pat2"
            },
            {
                id: "3",
                name: "pat3wertyuiopoiuytrertyukl;;lkjhgfdfghjkl;lkjhytrtyuio"
            },
            {
                id: "4",
                name: "test_modal"
            },
            {
                id: "5",
                name: "pat3wertyuiopoiuytrertyukl;;lkjhgfdfghjkl;lkjhytrtyuio"
            },
        ];
    }
}