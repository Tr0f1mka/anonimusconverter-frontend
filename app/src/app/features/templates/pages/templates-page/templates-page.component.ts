import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-templates-page',
    templateUrl: 'templates-page.component.html',
    styleUrl: 'templates-page.component.css'
})
export class TemplatesPageComponent implements OnInit {
    templates: any[] = [];

    ngOnInit() {
        // Загрузка шаблонов
        this.loadTemplates();
    }

    loadTemplates(): void {
        // Заглушка
        this.templates = [
            {
                id: 1,
                name: 'Шаблон1'
            },
            {
                id: 2,
                name: 'Шаблон2'
            },
            {
                id: 3,
                name: 'Шаблон3'
            }
        ];
    }
}