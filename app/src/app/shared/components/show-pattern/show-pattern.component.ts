import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Pattern, Modification } from 'src/app/core/models/pattern.model';
import { PatternService } from 'src/app/core/services/pattern.service';
import { ModalService } from 'src/app/core/services/modal.service';
import { BehaviorSubject, count, forkJoin, retry } from 'rxjs';
import { LanguageService } from 'src/app/core/services/language.service';

@Component({
    selector: 'show-pattern-modal',
    templateUrl: 'show-pattern.component.html',
    styleUrl: 'show-pattern.component.css'
})
export class ShowPatternComponent implements OnInit, OnChanges {
    @Input() pattern: Pattern = {id: '', name: ''};
    @Output() isOpenChange = new EventEmitter<boolean>();

    isOpen: boolean = false;
    isLoading: boolean = false;
    isLoadingPage: boolean = false;

    // Пагинация
    countModifications: number = 0;
    currentPage: number = 1;
    pageSize: number = 5;
    totalPages = 0;
    
    // Данные
    currentModifications: Modification[] = [];
    nextModifications: Modification[] = [];
    prevModifications: Modification[] = [];

    constructor(
        private patternService: PatternService,
        private modalService: ModalService,
        private languageService: LanguageService,
        private cdr: ChangeDetectorRef
    ) {}
    
    ngOnInit() {}
    
    ngOnChanges() {}
    
    openWindow() {
        if (this.isLoading) return;

        this.isLoading = true;
        this.resetState();

        forkJoin({
            count: this.patternService.getCountModifications(this.pattern.id),
            modifications: this.patternService.getModifications(this.pattern.id, this.pageSize, 1)
        }).subscribe({
            next: ({ count, modifications }) => {
                this.countModifications = count;
                this.totalPages = Math.ceil(count / this.pageSize);
                this.currentModifications = modifications;
                this.currentPage = 1;
                this.isLoading = false;
                this.isOpen = true;
                this.cdr.detectChanges();

                if (this.totalPages > 1) {
                    this.patternService.getModifications(this.pattern.id, this.pageSize, 2).subscribe({
                        next: (modifications) => {
                            this.nextModifications = modifications;
                        },
                        error: (error) => {
                            console.error('Failed to load next modifications:', error);
                            this.nextModifications = [];
                        }
                    });
                }
            },
            error: (error) => {
                console.error('Failed to load modifications:', error);
                this.isLoading = false;
                this.modalService.open({
                    id: 'open-pattern-modal',
                    title: this.languageService.translate('errorTitle'),
                    content: [this.languageService.translate('errorModificationLoad')],
                    type: 'info',
                    size: 'small'
                });
            }
        });
    }
    
    previousPage() {
        //Предыдущая страница
        if (this.currentPage <= 1 || this.isLoadingPage) return;

        this.isLoadingPage = true;

        if (!this.prevModifications || this.prevModifications.length === 0) {
            this.loadPageDirect(this.currentPage - 1);
            return;
        }

        this.nextModifications = this.currentModifications;
        this.currentModifications = this.prevModifications;
        this.currentPage--;
        this.cdr.detectChanges();

        if (this.currentPage > 1) {
            this.patternService.getModifications(this.pattern.id, this.pageSize, this.currentPage-1).subscribe({
                next: (modifications) => {
                    this.prevModifications = modifications;
                    this.isLoadingPage = false;
                },
                error: (error) => {
                    console.error('Failed to load previous modifications:', error);
                    this.prevModifications = [];
                    this.isLoadingPage = false;
                }
            });
        }
        else {
            this.prevModifications = [];
            this.isLoadingPage = false;
        }
    }
    
    nextPage() {
        //Следующая страница

        if (this.currentPage === this.totalPages || this.isLoadingPage) return;

        this.isLoadingPage = true;

        if (!this.nextModifications || this.nextModifications.length === 0) {
            this.loadPageDirect(this.currentPage+1);
            return;
        }

        this.prevModifications = this.currentModifications;
        this.currentModifications = this.nextModifications;
        this.currentPage++;
        this.cdr.detectChanges();

        if (this.currentPage < this.totalPages) {
            this.patternService.getModifications(this.pattern.id, this.pageSize, this.currentPage+1).subscribe({
                next: (modifications) => {
                    this.nextModifications = modifications;
                    this.isLoadingPage = false;
                },
                error: (error) => {
                    console.error('Failed to load next modifications:', error);
                    this.nextModifications = [];
                    this.isLoadingPage = false;
                }
            });
        }
        else {
            this.nextModifications = [];
            this.isLoadingPage = false;
        }
    }
    
    goToPage(page: number) {
        //Переход на страницу
        if (this.currentPage === page ||
            page < 1 ||
            page > this.totalPages ||
            this.isLoadingPage
        ) return;
        
        if (page - this.currentPage === 1) {
            this.nextPage();
            return;
        }

        if (page - this.currentPage === -1) {
            this.previousPage();
            return;
        }
        
        this.loadPageDirect(page);
    }
    
    loadPageDirect(page: number) {
        // Загрузка страницы
        this.isLoadingPage = true;

        this.patternService.getModifications(this.pattern.id, this.pageSize, page).subscribe({
            next: (modifications) => {
                this.currentModifications = modifications;
                this.currentPage = page;
                this.cdr.detectChanges();
                if (page < this.totalPages) {
                    this.patternService.getModifications(this.pattern.id, this.pageSize, page+1).subscribe({
                        next: (modifications) => {
                            this.nextModifications = modifications;
                        },
                        error: (error) => {
                            console.error('Failed to load next modifications:', error);
                            this.nextModifications = [];
                        }
                    });
                }
                else {
                    this.nextModifications = [];
                }

                if (page > 1) {
                    this.patternService.getModifications(this.pattern.id, this.pageSize, page-1).subscribe({
                        next: (modifications) => {
                            this.prevModifications = modifications;
                        },
                        error: (error) => {
                            console.error('Failed to load next modifications:', error);
                            this.prevModifications = [];
                        }
                    });
                }
                else {
                    this.prevModifications = [];
                }
                this.isLoadingPage = false;
            },
            error: (error) => {
                console.error('Failed to load modifications:', error);
                this.currentModifications = [];
                this.isLoadingPage = false;
            }
        });
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
    

    resetState() {
        // Сброс модалки
        this.currentModifications = [];
        this.prevModifications = [];
        this.nextModifications = [];
        this.totalPages = 0;
        this.currentPage = 1;
        this.countModifications = 0;
        this.isLoadingPage = false;
    }


    closeModal() {
        //Закрытие модалки
        this.isOpen = false;
        this.isOpenChange.emit(false);
        this.resetState();
    }
}