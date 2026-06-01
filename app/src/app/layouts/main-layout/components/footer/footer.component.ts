import { Component } from '@angular/core';
import { ModalService } from '../../../../core/services/modal.service';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
    selector: 'app-footer',
    templateUrl: 'footer.component.html',
    styleUrl: 'footer.component.css'
})
export class FooterComponent {
    constructor(
        private modalService: ModalService,
        private languageService: LanguageService
    ) {}

    showHelp(event: Event): void {
        event.preventDefault();
        this.modalService.open({
            id: 'footer-help-modal',
            title: this.languageService.translate('helpTitle'),
            content: [
                this.languageService.translate('helpContent1'),
                this.languageService.translate('helpContent2')
            ],
            type: 'help',
            size: 'medium'
        });
    }

    showDev(event: Event): void {
        event.preventDefault();
        this.modalService.open({
            id: 'footer-dev-modal',
            title: this.languageService.translate('devTitle'),
            content: [
                `${this.languageService.translate('apiEndpoint')} https://cson.site/api/v1`,
                `${this.languageService.translate('documentation')} https://github.com/kekishev/Converter/tree/main`,
                `${this.languageService.translate('github')} https://github.com/kekishev/Converter/tree/main`
            ],
            type: 'dev',
            size: 'medium'
        });
    }
}