import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../core/services/modal.service';
import { LanguageService } from '../../core/services/language.service';
import { Observable } from 'rxjs';
import { ModalConfig } from '../../core/models/modal.model';

@Component({
  selector: 'app-main-layout',
  templateUrl: 'main-layout.component.html',
  styleUrl: 'main-layout.component.css'
})
export class MainLayoutComponent implements OnInit {
  modals$: Observable<ModalConfig[]>;

  constructor(
    private modalService: ModalService,
    private languageService: LanguageService
  ) {
    this.modals$ = this.modalService.modals$;
  }

  ngOnInit() {
    // Подписываемся на изменения языка для обновления контента модалок
    this.languageService.currentLanguage$.subscribe();
  }

  closeModal(id: string): void {
    this.modalService.close(id);
  }
}