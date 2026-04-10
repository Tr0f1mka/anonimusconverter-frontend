import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Pattern } from '../../../core/models/pattern.model';
import { PatternService } from 'src/app/core/services/pattern.service';
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
    
    showModal = false;
    isLoading = false;
    patterns: Pattern[] = [];
    filteredPatterns: Pattern[] = [];
    searchQuery = '';
    totalPatterns = 0;
    
    private subscriptions: Subscription[] = [];

    constructor(
        private patternService: PatternService,
        private authService: AuthService,
        private modalService: ModalService,
        private languageService: LanguageService
    ) {}

    ngOnInit(): void {}

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }

    openPatternSelector(): void {
      // Проверяем авторизацию
        if (!this.authService.isLoggedInSync()) {
            this.modalService.open({
                id: 'auth-required',
                title: 'Требуется авторизация',
                content: ['Для выбора шаблона необходимо войти в систему'],
                type: 'warning',
                size: 'small'
            });
            return;
        }

        this.showModal = true;
        this.loadPatterns();
    }

    closeModal(): void {
        this.showModal = false;
        this.searchQuery = '';
    }

    loadPatterns(): void {
        this.isLoading = true;
        
        this.patternService.patterns$.subscribe(patterns => {
            if (patterns) {
                this.patterns = patterns;
                this.isLoading = false;
            }
        });
    }

    // filterPatterns(): void {
    //     if (!this.searchQuery.trim()) {
    //         this.filteredPatterns = this.patterns;
    //         return;
    //     }

    //     const query = this.searchQuery.toLowerCase().trim();
    //     this.filteredPatterns = this.patterns.filter(pattern => 
    //         pattern.name.toLowerCase().includes(query)
    //     );
    // }

    selectPattern(pattern: Pattern): void {
        this.selectedPattern = pattern;
        this.patternSelected.emit(pattern);
        this.closeModal();
    }

    clearPattern(event: Event): void {
        event.stopPropagation();
        this.selectedPattern = null;
        this.patternSelected.emit(null);
    }

    createPattern(): void {
        this.closeModal();
        
        this.modalService.open({
            id: 'create-pattern',
            title: 'Создание шаблона',
            content: ['Функция создания шаблона будет доступна позже'],
            type: 'info',
            size: 'medium'
        });
    }
}