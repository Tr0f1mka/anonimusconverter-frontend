import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, throwError, tap, findIndex, delay, takeUntil, switchMap, Subject, debounceTime } from 'rxjs';
import { Pattern, NewPattern, UpdetePattern, Modification } from '../models/pattern.model';
import { APIPathes } from 'src/app/api-pathes';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class PatternService {
    private apiUrl = APIPathes.patterns;
    private apiModifications = APIPathes.modifications;

    // Управляющие переменные
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private errorSubject = new BehaviorSubject<string | null>(null);
    private currentPageSubject = new BehaviorSubject<number>(1);
    private totalPagesSubject = new BehaviorSubject<number>(0);
    private cancelRequests = new Subject<void>();
    private refreshRequest = new Subject<boolean>();
    private destroy$ = new Subject<void>();

    // Хранилища шаблонов
    private patternStorage = new BehaviorSubject<Pattern[]|null>(null);
    private previousPatternStorage = new BehaviorSubject<Pattern[]|null>(null);
    private nextPatternStorage = new BehaviorSubject<Pattern[]|null>(null);

    // Порты управляющих переменных
    public loading$ = this.loadingSubject.asObservable();
    public error$ = this.errorSubject.asObservable();
    public currentPage$ = this.currentPageSubject.asObservable();
    public totalPages$ = this.totalPagesSubject.asObservable();

    // Порты хранилищ
    public patterns$ = this.patternStorage.asObservable();
    public previous_patterns$ = this.previousPatternStorage.asObservable();
    public next_patterns$ = this.nextPatternStorage.asObservable();


    private countPatterns: number = 0;
    public patternsPerPage: number = 18;
    public currentPage: number = 1;
    private currentUserId: string | null = null;
    private refreshInProgress: boolean = false;
    private operationInProgress: boolean = false;


    constructor(
        private http: HttpClient,
        private auth_service: AuthService
    ) {
        this.auth_service.getCurrentUser().pipe(
            takeUntil(this.destroy$)
        ).subscribe(user => {
            if (user) {
                this.currentUserId = user.id;
                this.initPatternStorage();
            }
            else {
                this.currentUserId = null;
                this.clearStorage();
            }
        });
        this.refreshRequest.pipe(
            debounceTime(100),
            switchMap((keepCurrentPage) => this.doRefreshStorage(keepCurrentPage).pipe(
                catchError(error => {
                    console.error('Refresh failed:', error);
                    this.errorSubject.next('Ошибка обновления данных');
                    return of(void 0); // Возвращаем void, чтобы поток не прерывался
                })
            )),
            takeUntil(this.destroy$)
        ).subscribe();
    }


    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.cancelRequests.next();
        this.cancelRequests.complete();
    }


    initPatternStorage(): void {
        if (!this.currentUserId) return;
        
        this.loadingSubject.next(true);
        
        this.getCountPatterns().subscribe({
            next: (count) => {
                this.countPatterns = count;
                this.totalPagesSubject.next(Math.ceil(count / this.patternsPerPage));

                
                this.getPatterns(1).subscribe({
                    next: (patterns) => {
                        this.patternStorage.next(patterns);
                        this.currentPage = 1;
                        this.currentPageSubject.next(1);
                        this.loadingSubject.next(false);
                        
                        if (this.countPatterns > this.patternsPerPage) {
                            this.getPatterns(2).subscribe({
                                next: (patterns) => this.nextPatternStorage.next(patterns),
                                error: (error) => {
                                    console.error('Failed to load next patterns', error);
                                    this.nextPatternStorage.next([]);
                                }
                            });
                        }
                    },
                    error: (error) => {
                        console.error('Failed to load patterns', error);
                        this.patternStorage.next([]);
                        this.loadingSubject.next(false);
                    }
                });
            },
            error: (error) => {
                console.error('Failed to load count patterns', error);
                this.countPatterns = 0;
                this.totalPagesSubject.next(0);
                this.patternStorage.next([]);
                this.nextPatternStorage.next([]);
                this.loadingSubject.next(false);
            }
        });
    }


    nextPagePatterns(): void {
        if (this.currentPageSubject.value*this.patternsPerPage >= this.countPatterns) {
            return;
        }

        this.previousPatternStorage.next(this.patternStorage.value);
        this.patternStorage.next(this.nextPatternStorage.value);
        this.currentPage++;
        this.currentPageSubject.next(this.currentPage);
        this.cancelPendingRequests();

        if (this.currentPage * this.patternsPerPage < this.countPatterns) {
            this.getPatterns(this.currentPage + 1).subscribe({
                next: (patterns) => {
                    this.nextPatternStorage.next(patterns);
                },
                error: (error) => {
                    console.log('Failed to load patterns:', error);
                    this.nextPatternStorage.next([]);
                }
            });
        }
        else {
            this.nextPatternStorage.next([]);
        }
    }


    prevPagePatterns(): void {
        if (this.currentPage <= 1) {
            return;
        }

        if (!this.previousPatternStorage.value || this.previousPatternStorage.value.length === 0) {
            console.warn('No previous page data available');
            return;
        }

        this.nextPatternStorage.next(this.patternStorage.value);
        this.patternStorage.next(this.previousPatternStorage.value);
        this.currentPage--;
        this.currentPageSubject.next(this.currentPage);
        this.cancelPendingRequests();

        if (this.currentPage > 1) {
            this.getPatterns(this.currentPage-1).subscribe({
                next: (patterns) => {
                    this.previousPatternStorage.next(patterns);
                },
                error: (error) => {
                    console.log('Failed to load patterns:', error);
                    this.previousPatternStorage.next([]);
                }
            });
        }
        else {
            this.previousPatternStorage.next([]);
        }
    }


    goToPage(page: number): void {
        if (page < 1 || page > this.totalPagesSubject.value) {
            return;
        }

        if (page === this.currentPage) {
            return;
        }

        if (page - this.currentPage == 1) {    //следующая страница
            this.nextPagePatterns();
            return;
        }
        if (page - this.currentPage == -1) {   //предыдущая страница
            this.prevPagePatterns();
            return;
        }

        this.cancelPendingRequests();
        this.getPatterns(page).subscribe({
            next: (patterns) =>{
                this.patternStorage.next(patterns);
                this.currentPage = page;
                this.currentPageSubject.next(page);

                if (page < this.totalPagesSubject.value) {
                    this.getPatterns(page + 1).subscribe({
                        next: (patterns) => {
                            this.nextPatternStorage.next(patterns);
                        },
                        error: (error) => {
                            console.error('Failed to load patterns:', error);
                            this.nextPatternStorage.next([]);
                        }
                    });
                } else {
                    this.nextPatternStorage.next([]);
                }

                if (page > 1) {
                    this.getPatterns(page - 1).subscribe({
                        next: (patterns) => {
                            this.previousPatternStorage.next(patterns);
                        },
                        error: (error) => {
                            console.error('Failed to load patterns:', error);
                            this.previousPatternStorage.next([]);
                        }
                    });
                } else {
                    this.previousPatternStorage.next([]);
                }
            },
            error(error) {
                console.log('Failed to load patterns:', error);
            }
        });
    }


    private cancelPendingRequests(): void {
        this.cancelRequests.next();
        // Создаём новый Subject для следующих запросов
        this.cancelRequests = new Subject<void>();
    }
    
    getPatterns(page: number): Observable<Pattern[]>{
        this.loadingSubject.next(true);
        this.errorSubject.next(null);
        
        const cancelSignal = this.cancelRequests;
        
        return this.http.get<Pattern[]>(`${this.apiUrl}/${this.currentUserId}/${this.patternsPerPage}/${page}`).pipe(
            takeUntil(cancelSignal),
            tap(() => this.loadingSubject.next(false)),
            catchError(error => {
                this.loadingSubject.next(false);
                const errorMsg = error.error?.message || 'Ошибка получения шаблонов';
                this.errorSubject.next(errorMsg);
                console.error('Error:', error);
                return throwError(() => new Error(errorMsg));
            })
        );
    }


    getCountPatterns(): Observable<number> {
        return this.http.get<number>(`${this.apiUrl}/${this.currentUserId}`).pipe(
            catchError(error => {
                console.log('Error:', error);
                return throwError(() => new Error(error.error?.message || 'Ошибка получения количества шаблонов'));
            })
        );   
    }


    getCountModifications(patternId: string): Observable<number> {
        return this.http.get<number>(`${this.apiModifications}/${patternId}`).pipe(
            catchError(error => {
                console.log('Error:', error);
                return throwError(() => new Error(error.error?.message || 'Ошибка получения количества модификаций'));
            })
        );   
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
        if (this.operationInProgress) {
            return throwError(() => new Error('Выполняется операция'))
        }
        this.operationInProgress = true;
        
        if (this.currentUserId) {
            pattern.userId = this.currentUserId;
        }
        console.log(pattern);
        return this.http.post<Pattern>(this.apiUrl, pattern).pipe(
            tap(() => {
                this.refreshStorage();
                this.operationInProgress = false;
            }),
            catchError(error => {
                console.error('Error:', error);
                this.operationInProgress = false;
                return throwError(() => new Error(error.error?.message || 'Ошибка создания шаблона'));
            })
        );
    }


    updatePattern(pattern: UpdetePattern): Observable<Pattern>{
        // Изменение шаблона
        if (this.operationInProgress) {
            return throwError(() => new Error('Выполняется операция'))
        }
        this.operationInProgress = true;
        
        return this.http.put<Pattern>(this.apiUrl, pattern).pipe(
            tap(() => {
                this.refreshStorage();
                this.operationInProgress = false;
            }),
            catchError(error => {
                console.error('Error:', error);
                this.operationInProgress = false;
                return throwError(() => new Error(error.error?.message || 'Ошибка изменения шаблона'));
            })
        );
    }


    deletePattern(patternId: string): Observable<{status: string, message: string}>{
        // Удаление шаблона
        if (this.operationInProgress) {
            return throwError(() => new Error('Выполняется операция'))
        }
        this.operationInProgress = true;
        
        return this.http.delete<{status: string, message: string}>(`${this.apiUrl}/${patternId}`).pipe(
            tap(() =>{
                this.refreshStorage();
                this.operationInProgress = false;
            }),
            catchError(error => {
                console.error('Error:', error);
                this.operationInProgress = false;
                return throwError(() => new Error(error.error?.message || 'Ошибка удаления шаблона'));
            })
        );
    }

    refreshStorage(keepCurrentPage: boolean = true) {
        this.refreshRequest.next(keepCurrentPage);
    }

    doRefreshStorage(keepCurrentPage: boolean = true): Observable<void> {
        return new Observable((observer) => {
            if (this.refreshInProgress) {
                console.warn('Refresh already in progress, skipping...');
                observer.next();
                observer.complete();
                return;
            }
            
            if (!this.currentUserId) {
                observer.next();
                observer.complete();
                return;
            }
            
            this.refreshInProgress = true;
            this.loadingSubject.next(true);
            
            const targetPage = keepCurrentPage ? this.currentPage : 1;
            
            this.getCountPatterns().pipe(
                takeUntil(this.destroy$)
            ).subscribe({
                next: (count) => {
                    this.countPatterns = count;
                    const totalPages = Math.ceil(count / this.patternsPerPage);
                    this.totalPagesSubject.next(totalPages);

                    let newCurrentPage = targetPage;
                    if (newCurrentPage > totalPages) {
                        newCurrentPage = Math.max(1, totalPages);
                    }
                    
                    this.currentPage = newCurrentPage;
                    this.currentPageSubject.next(this.currentPage);
                    
                    this.getPatterns(this.currentPage).subscribe({
                        next: (patterns) => {
                            this.patternStorage.next(patterns);
                            
                            if (this.currentPage * this.patternsPerPage < this.countPatterns) {
                                this.getPatterns(this.currentPage + 1).subscribe({
                                    next: (patterns) => this.nextPatternStorage.next(patterns),
                                    error: (error) => {
                                        console.error('Failed to load next page', error);
                                        this.nextPatternStorage.next([]);
                                    }
                                });
                            } else {
                                this.nextPatternStorage.next([]);
                            }
                            
                            if (this.currentPage > 1) {
                                this.getPatterns(this.currentPage - 1).subscribe({
                                    next: (patterns) => this.previousPatternStorage.next(patterns),
                                    error: (error) => {
                                        console.error('Failed to load previous page', error);
                                        this.previousPatternStorage.next([]);
                                    }
                                });
                            } else {
                                this.previousPatternStorage.next([]);
                            }
                            
                            this.refreshInProgress = false;
                            this.loadingSubject.next(false);
                            observer.next();
                            observer.complete();
                        },
                        error: (error) => {
                            console.error('Failed to load current page', error);
                            this.refreshInProgress = false;
                            this.loadingSubject.next(false);
                            observer.error(error);
                        }
                    });
                },
                error: (error) => {
                    console.error('Failed to load count', error);
                    this.refreshInProgress = false;
                    this.loadingSubject.next(false);
                    observer.error(error);
                }
            });
        });

        // if (this.refreshInProgress) {
        //     console.warn('Refresh already in progress, skipping...');
        //     return;
        // }
        
        // if (!this.currentUserId) return;
        
        // this.refreshInProgress = true;
        // this.loadingSubject.next(true);
        
        // // Целевая страница
        // const targetPage = keepCurrentPage ? this.currentPage : 1;
        
        // this.getCountPatterns().subscribe({
        //     next: (count) => {
        //         this.countPatterns = count;
                
        //         const totalPages = Math.ceil(count / this.patternsPerPage);
        //         this.totalPagesSubject.next(totalPages);

        //         // Корректируем целевую страницу, если она выходит за пределы
        //         let newCurrentPage = targetPage;
        //         if (newCurrentPage > totalPages) {
        //             newCurrentPage = Math.max(1, totalPages);
        //         }
                
        //         // Обновляем текущую страницу
        //         this.currentPage = newCurrentPage;
        //         this.currentPageSubject.next(this.currentPage);
                
        //         // Загружаем обновлённую текущую страницу
        //         this.getPatterns(this.currentPage).subscribe({
        //             next: (patterns) => {
        //                 this.patternStorage.next(patterns);
                        
        //                 // Загружаем следующую страницу
        //                 if (this.currentPage * this.patternsPerPage < this.countPatterns) {
        //                     this.getPatterns(this.currentPage + 1).subscribe({
        //                         next: (patterns) => this.nextPatternStorage.next(patterns),
        //                         error: (error) => {
        //                             console.error('Failed to load next page', error);
        //                             this.nextPatternStorage.next([]);
        //                         }
        //                     });
        //                 } else {
        //                     this.nextPatternStorage.next([]);
        //                 }
                        
        //                 // Загружаем предыдущую страницу
        //                 if (this.currentPage > 1) {
        //                     this.getPatterns(this.currentPage - 1).subscribe({
        //                         next: (patterns) => this.previousPatternStorage.next(patterns),
        //                         error: (error) => {
        //                             console.error('Failed to load previous page', error);
        //                             this.previousPatternStorage.next([]);
        //                         }
        //                     });
        //                 } else {
        //                     this.previousPatternStorage.next([]);
        //                 }
                        
        //                 this.refreshInProgress = false;
        //                 this.loadingSubject.next(false);
        //             },
        //             error: (error) => {
        //                 console.error('Failed to load current page', error);
        //                 this.refreshInProgress = false;
        //                 this.loadingSubject.next(false);
        //             }
        //         });
        //     },
        //     error: (error) => {
        //         console.error('Failed to load count', error);
        //         this.refreshInProgress = false;
        //         this.loadingSubject.next(false);
        //     }
        // });
    }


    clearStorage() {
        this.patternStorage.next([]);
        this.previousPatternStorage.next([]);
        this.nextPatternStorage.next([]);
        this.countPatterns = 0;
        this.currentPage = 1;
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