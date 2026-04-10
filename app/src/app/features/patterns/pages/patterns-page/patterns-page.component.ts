import { Component, OnInit } from '@angular/core';
import { Pattern } from 'src/app/core/models/pattern.model';
import { PatternService } from 'src/app/core/services/pattern.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
    selector: 'app-patterns-page',
    templateUrl: 'patterns-page.component.html',
    styleUrl: 'patterns-page.component.css'
})
export class PatternsPageComponent implements OnInit {
    patterns: Pattern[] = [];
    isLoading: boolean = true;
    currentUserId: string | null = null;

    selectedPattern: Pattern = {id: '', name: '', modifications: []};
    isOpenShowModal: boolean = false;
    isOpenCreateModal: boolean = false;

    constructor(
        private patternService: PatternService,
        private authService: AuthService,
        private modalService: ModalService
    ) {}

    ngOnInit() {
        this.authService.getCurrentUser().subscribe(user => {
            if (user) {
                this.currentUserId = user.id;
            }
        })
        this.patternService.patterns$.subscribe(patterns => {
            if (patterns) {
                this.patterns = patterns;
                this.isLoading = false;
            }
        });
    }

    createPattern() {
        this.isOpenCreateModal = true;
    }

    openPattern(pattern: Pattern): void {
        this.isOpenShowModal = true;
        this.selectedPattern = pattern;
    }

    updatePattern(pattern: Pattern): void {
        console.log("update", pattern);
    }

    deletePattern(pattern: Pattern): void {
        console.log("delete", pattern);
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