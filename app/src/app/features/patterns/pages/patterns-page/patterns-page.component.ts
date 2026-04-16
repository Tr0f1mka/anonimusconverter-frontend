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

    private subscriptions: Subscription[] = [];

    // isDeleting: boolean = false;

    constructor(
        private patternService: PatternService,
        private authService: AuthService,
        private modalService: ModalService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {

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
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
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