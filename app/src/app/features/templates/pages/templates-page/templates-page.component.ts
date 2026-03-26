import { Component, OnInit } from '@angular/core';
import { Pattern } from 'src/app/core/models/template.model';
import { TemplateService } from 'src/app/core/services/template.service';

@Component({
    selector: 'app-templates-page',
    templateUrl: 'templates-page.component.html',
    styleUrl: 'templates-page.component.css'
})
export class TemplatesPageComponent implements OnInit {
    templates: Pattern[] = [];

    constructor(
        private templateService: TemplateService
    ) {}

    ngOnInit() {
        // Загрузка шаблонов
        this.loadTemplates();
    }

    loadTemplates(): void {
        this.templates = this.templateService.loadTemplates();
        // this.templates = [];
    }
}