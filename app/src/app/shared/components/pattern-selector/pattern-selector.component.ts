import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Pattern } from '../../../core/models/pattern.model';
import { PatternSelectorService } from 'src/app/core/services/pattern-page.service';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { LanguageService } from '../../../core/services/language.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-pattern-selector',
    templateUrl: 'pattern-selector.component.html',
    styleUrl: 'pattern-selector.component.css'
})
export class PatternSelectorComponent implements OnInit, OnDestroy {
    @Input() selectedPattern: Pattern | null = null;
    @Output() patternSelected = new EventEmitter<Pattern | null>();
    
    showModal: boolean = false;
    patterns: Pattern[] = [];
    filteredPatterns: Pattern[] = [];
    searchQuery = '';
    currentUserId: string | null = null;
    isLoading: boolean = true;
    currentPage: number = 1;
    totalPages: number = 1;

    isOpenShowModal: boolean = false;
    selectedShowPattern: Pattern = {id: '', name: ''};
    
    private subscriptions: Subscription[] = [];

    constructor(
        private patternService: PatternSelectorService,
        private authService: AuthService,
        private modalService: ModalService,
        private languageService: LanguageService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
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

    openPatternSelector(): void {
        // Проверяем авторизацию
        if (!this.authService.isLoggedInSync()) {
            this.modalService.open({
                id: 'auth-required',
                title: this.languageService.translate('authRequired'),
                content: [this.languageService.translate('authRequiredDescription')],
                type: 'warning',
                size: 'small'
            });
            return;
        }

        this.showModal = true;
        this.loadPatterns();
    }

    closeModal(): void {
        if (!this.isOpenShowModal) {
            this.showModal = false;
            this.searchQuery = '';
        }
    }

    loadPatterns(): void {
        this.patternService.patterns$.subscribe(patterns => {
            if (patterns) {
                this.patterns = patterns;
                this.filteredPatterns = patterns;
            }
        });

        // this.filteredPatterns = this.patternService.stub();
        // this.currentPage = 1;
        // this.totalPages = 4;
    }

    filterPatterns(): void {
        if (!this.searchQuery.trim()) {
            this.filteredPatterns = this.patterns;
            return;
        }

        const query = this.searchQuery.toLowerCase().trim();
        this.filteredPatterns = this.patterns.filter(pattern => 
            pattern.name.toLowerCase().includes(query)
        );
    }

    selectPattern(pattern: Pattern): void {
        this.selectedPattern = pattern;
        this.patternSelected.emit(pattern);
        this.closeModal();
    }

    openPattern(pattern: Pattern, event: Event): void {
        event.stopPropagation();
        event.preventDefault();
        this.selectedShowPattern = pattern;
        this.isOpenShowModal = true;
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

    onShowModalClosed(): void {
        this.isOpenShowModal = false;
    }

    clearPattern(event: Event): void {
        event.stopPropagation();
        this.selectedPattern = null;
        this.patternSelected.emit(null);
    }
}