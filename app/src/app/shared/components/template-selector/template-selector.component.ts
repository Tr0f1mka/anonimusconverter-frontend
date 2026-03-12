import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { Template } from '../../../core/models/template.model';
import { TemplateService } from '../../../features/templates/services/template.service';
import { AuthService } from '../../../core/services/auth.service';
import { ModalService } from '../../../core/services/modal.service';
import { LanguageService } from '../../../core/services/language.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-template-selector',
  templateUrl: 'template-selector.component.html',
  styleUrl: 'template-selector.component.css'
})
export class TemplateSelectorComponent implements OnInit, OnDestroy {
  @Input() selectedTemplate: Template | null = null;
  @Output() templateSelected = new EventEmitter<Template | null>();
  
  showModal = false;
  isLoading = false;
  templates: Template[] = [];
  filteredTemplates: Template[] = [];
  searchQuery = '';
  totalTemplates = 0;
  
  private subscriptions: Subscription[] = [];

  constructor(
    private templateService: TemplateService,
    private authService: AuthService,
    private modalService: ModalService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  openTemplateSelector(): void {
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
    this.loadTemplates();
  }

  closeModal(): void {
    this.showModal = false;
    this.searchQuery = '';
  }

  loadTemplates(): void {
    this.isLoading = true;
    
    this.templateService.getTemplates().subscribe({
      next: (response) => {
        this.templates = response.templates;
        this.filteredTemplates = response.templates;
        this.totalTemplates = response.total;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Ошибка загрузки шаблонов:', error);
        this.modalService.open({
          id: 'template-load-error',
          title: 'Ошибка',
          content: ['Не удалось загрузить список шаблонов'],
          type: 'warning',
          size: 'small'
        });
        this.isLoading = false;
        this.closeModal();
      }
    });
  }

  filterTemplates(): void {
    if (!this.searchQuery.trim()) {
      this.filteredTemplates = this.templates;
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.filteredTemplates = this.templates.filter(template => 
      template.name.toLowerCase().includes(query) ||
      (template.description && template.description.toLowerCase().includes(query))
    );
  }

  selectTemplate(template: Template): void {
    this.selectedTemplate = template;
    this.templateSelected.emit(template);
    this.closeModal();
  }

  clearTemplate(event: Event): void {
    event.stopPropagation();
    this.selectedTemplate = null;
    this.templateSelected.emit(null);
  }

  createTemplate(): void {
    this.closeModal();
    
    this.modalService.open({
      id: 'create-template',
      title: 'Создание шаблона',
      content: ['Функция создания шаблона будет доступна позже'],
      type: 'info',
      size: 'medium'
    });
  }
}