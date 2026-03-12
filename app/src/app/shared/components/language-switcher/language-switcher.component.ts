import { Component } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';
import { Observable } from 'rxjs';
import { Language } from '../../../core/models/language.model';

@Component({
  selector: 'app-language-switcher',
  templateUrl: "language-switcher.component.html",
  styleUrl: "language-switcher.component.css"
})
export class LanguageSwitcherComponent {
  currentLang$: Observable<Language>;

  constructor(private languageService: LanguageService) {
    this.currentLang$ = this.languageService.currentLanguage$;
  }

  setLanguage(lang: 'ru' | 'en'): void {
    this.languageService.setLanguage(lang);
  }
}