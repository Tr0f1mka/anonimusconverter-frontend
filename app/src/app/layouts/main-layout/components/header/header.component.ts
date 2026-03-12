import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../../../core/services/language.service';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-header',
  templateUrl: 'header.component.html',
  styleUrl: 'header.component.css'
})
export class HeaderComponent {
  constructor(
    private router: Router,
    private languageService: LanguageService,
    private modalService: ModalService
  ) {}

  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  showHelpModal(): void {
    this.modalService.open({
      id: 'help-modal',
      title: this.languageService.translate('helpTitle'),
      content: [
        this.languageService.translate('helpContent1'),
        this.languageService.translate('helpContent2')
      ],
      type: 'help',
      size: 'medium'
    });
  }
}