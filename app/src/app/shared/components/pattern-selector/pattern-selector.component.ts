import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
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
    
    showModal: boolean = false;
    patterns: Pattern[] = [];
    filteredPatterns: Pattern[] = [];
    searchQuery = '';
    totalPatterns = 0;
    isLoading: boolean = true;

    isOpenShowModal: boolean = false;
    selectedShowPattern: Pattern = {id: '', name: '', modifications: []};
    
    private subscriptions: Subscription[] = [];

    constructor(
        private patternService: PatternService,
        private authService: AuthService,
        private modalService: ModalService,
        private languageService: LanguageService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.subscriptions.push(
            this.patternService.patterns$.subscribe(patterns => {
                if (patterns) {
                    this.patterns = patterns;
                    this.filteredPatterns = patterns;
                    this.totalPatterns = patterns.length;
                    this.isLoading = false;
                }
                this.cdr.detectChanges();
            })
        );
    }

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
        this.patternService.patterns$.subscribe(patterns => {
            if (patterns) {
                this.patterns = patterns;
                this.filteredPatterns = patterns;
                this.totalPatterns = patterns.length;
            }
        });
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
        this.closeModal();
        this.selectedShowPattern = pattern;
        this.isOpenShowModal = true;
    }

    onShowModalClosed(): void {
        this.showModal = true;
    }

    clearPattern(event: Event): void {
        event.stopPropagation();
        this.selectedPattern = null;
        this.patternSelected.emit(null);
    }
}