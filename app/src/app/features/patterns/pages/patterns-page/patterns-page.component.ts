import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Pattern } from 'src/app/core/models/pattern.model';
import { PatternService } from 'src/app/core/services/pattern.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-patterns-page',
    templateUrl: 'patterns-page.component.html',
    styleUrl: 'patterns-page.component.css'
})
export class PatternsPageComponent implements OnInit {
    patterns: Pattern[] = [];
    isDeleting: boolean = false;
    isLoading: boolean = true;
    currentUserId: string | null = null;
    currentPage: number = 1;
    totalPages: number = 1;

    private subscriptions: Subscription[] = [];


    constructor(
        private patternService: PatternService,
        private authService: AuthService,
        private modalService: ModalService,
        private cdr: ChangeDetectorRef
    ) {
        
    }

    ngOnInit() {
        // юзер
        this.subscriptions.push(
            this.authService.getCurrentUser().subscribe(user => {
                if (user) {
                    this.currentUserId = user.id;
                }
                else {
                    this.currentUserId = null;
                }
                this.cdr.detectChanges();
            })
        );

        // шаблоны
        this.subscriptions.push(
            this.patternService.patterns$.subscribe(patterns => {
                console.log(patterns);
                if (patterns) {
                    this.patterns = patterns;
                    this.isLoading = false;
                }
                this.cdr.detectChanges();
            })
        );

        // текущая страница
        this.subscriptions.push(
            this.patternService.currentPage$.subscribe(page => {
                this.currentPage = page;
                this.cdr.detectChanges();
            })
        );

        // всего страниц
        this.subscriptions.push(
            this.patternService.totalPages$.subscribe(pages =>{
                this.totalPages = pages;
                this.cdr.detectChanges();
            })
        );

        // загрузка
        this.subscriptions.push(
            this.patternService.loading$.subscribe(loading => {
                this.isLoading = loading;
                this.cdr.detectChanges();
            })
        )
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    
    previousPage() {
        //Предыдущая страница
        this.patternService.prevPagePatterns();
    }
    
    nextPage() {
        //Следующая страница
        this.patternService.nextPagePatterns();
    }
    
    goToPage(page: number) {
        //Переход на страницу
        if (page !== this.currentPage) {
            this.patternService.goToPage(page);
        }
    }
    
    getPages(): number[] {
        //Взятие страниц
        const pages: number[] = [];
        const maxVisible = 5;
        
        if (this.totalPages <= maxVisible) {
            for (let i = 1; i <= this.totalPages; i++) {
                pages.push(i);
            }
        } else {
            let start = Math.max(1, this.currentPage - 2);
            let end = Math.min(this.totalPages, start + maxVisible - 1);
            
            if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
            }
            
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }
        
        return pages;
    }


    deletePattern(pattern: Pattern): void {
        this.isDeleting = true;
        console.log('azaza', pattern);
        this.patternService.deletePattern(pattern.id).subscribe({
            next: () => {
                this.isDeleting = false;
                // this.modalService.open({
                //     id: 'update-pattern-success',
                //     title: 'Успех',
                //     content: ['Создание шаблона прошло успешно! Теперь вы можете его использовать'],
                //     type: 'info',
                //     size: 'small'
                // });
            },
            error: (error) => {
                this.isLoading = false;
                this.modalService.open({
                    id: 'delete-pattern-error',
                    title: 'Ошибка',
                    content: [error.message || 'Не удалось удалить шаблон'],
                    type: 'warning',
                    size: 'small'
                });
            }
        });
    }

    openHelp() {
        this.modalService.open({
            id: "pattern-help",
            title: "Помощь",
            content: [
                "Создайте шаблон",
                "Посмотрите шаблон",
                "Измените шаблон",
                "Удалите шаблон"
            ],
            type: "info",
            size: "medium"
        })
    }
}