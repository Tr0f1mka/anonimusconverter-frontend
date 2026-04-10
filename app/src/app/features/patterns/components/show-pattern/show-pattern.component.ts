// show-pattern.component.ts
import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';
import { Pattern } from 'src/app/core/models/pattern.model';

@Component({
    selector: 'show-pattern-modal',
    templateUrl: 'show-pattern.component.html',
    styleUrl: 'show-pattern.component.css'
})
export class ShowPatternComponent implements OnInit, OnChanges {
    @Input() pattern: Pattern = {id: '', name: '', modifications: []};
    @Input() isOpen: boolean = false;
    @Output() isOpenChange = new EventEmitter<boolean>();

    // Пагинация
    currentPage: number = 1;
    pageSize: number = 5;
    
    // Сортировка
    sortColumn: string = 'old_name';
    sortDirection: 'asc' | 'desc' = 'asc';
    
    // Данные
    paginatedModifications: any[] = [];
    
    ngOnInit() {
        this.updateTable();
    }
    
    ngOnChanges() {
        this.currentPage = 1;
        this.updateTable();
    }
    
    get totalItems(): number {
        //Всего элементов
        return this.pattern.modifications?.length || 0;
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
        if (!this.pattern?.modifications) return;
        
        const startIndex = (this.currentPage - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.paginatedModifications = this.pattern.modifications.slice(startIndex, endIndex);
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