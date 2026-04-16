// show-pattern.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Pattern, Modification } from 'src/app/core/models/pattern.model';
import { PatternService } from 'src/app/core/services/pattern.service';
import { ModalService } from 'src/app/core/services/modal.service';

@Component({
    selector: 'show-pattern-modal',
    templateUrl: 'show-pattern.component.html',
    styleUrl: 'show-pattern.component.css'
})
export class ShowPatternComponent implements OnInit, OnChanges {
    @Input() pattern: Pattern = {id: '', name: ''};
    @Output() isOpenChange = new EventEmitter<boolean>();

    isOpen: boolean = false;

    // Пагинация
    currentPage: number = 1;
    pageSize: number = 5;
    
    
    // Данные
    modifications: Modification[] = [];
    paginatedModifications: Modification[] = [];

    constructor(
        private patternService: PatternService,
        private modalService: ModalService,
        private cdr: ChangeDetectorRef
    ) {}
    
    ngOnInit() {
        this.updateTable();
    }
    
    ngOnChanges() {
        this.currentPage = 1;
        this.updateTable();
    }
    
    openWindow() {
        this.patternService.getModifications(this.pattern.id, 100, 1).subscribe({
            next: (modifications) => {
                this.modifications = modifications;
                this.isOpen = true;
                this.updateTable();
            },
            error: (error) => {
                console.error('Failed to load modifications', error);
                this.modifications = [];
                this.modalService.open({
                    id: 'open-pattern-modal',
                    title: 'Ошибка',
                    content: ['Ошибка загрузки модификаций шаблона'],
                    type: 'info',
                    size: 'small'
                });
            }
        });
    }

    get totalItems(): number {
        //Всего элементов
        return this.modifications?.length || 0;
    }
    
    get totalPages(): number {
        //Всего страниц
        return Math.ceil(this.totalItems / this.pageSize);
    }
    
    get startItem(): number {
        //Первый элемент страницы
        if (this.totalItems === 0) return 0;
        return (this.currentPage - 1) * this.pageSize + 1;
    }
    
    get endItem(): number {
        //Последний элемент страницы
        return Math.min(this.currentPage * this.pageSize, this.totalItems);
    }
    
    updateTable() {
        //Обновление таблицы
        if (!this.modifications) return;
        
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedModifications = this.modifications.slice(startIndex, endIndex);

        this.cdr.detectChanges();
    }
    
    previousPage() {
        //Предыдущая страница
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updateTable();
        }
    }
    
    nextPage() {
        //Следующая страница
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updateTable();
        }
    }
    
    goToPage(page: number) {
        //Переход на страницу
        this.currentPage = page;
        this.updateTable();
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
    
    closeModal() {
        //Закрытие модалки
        this.isOpen = false;
        this.isOpenChange.emit(false);
    }
}