import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Language, TRANSLATIONS } from '../models/language.model';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private currentLang = new BehaviorSubject<Language>(this.getInitialLanguage());
    private translations = TRANSLATIONS;

    constructor() {
        // Сохраняем язык при изменении
        this.currentLang.subscribe(lang => {
            localStorage.setItem('preferredLanguage', lang);
        });
    }

    private getInitialLanguage(): Language {
        const saved = localStorage.getItem('preferredLanguage') as Language;
        if (saved && (saved === 'ru' || saved === 'en')) {
            return saved;
        }
        
        const browserLang = navigator.language.split('-')[0];
        return (browserLang === 'ru') ? 'ru' : 'en';
    }

    get currentLanguage$(): Observable<Language> {
        return this.currentLang.asObservable();
    }

    get currentLanguage(): Language {
        return this.currentLang.value;
    }

    setLanguage(lang: Language): void {
        this.currentLang.next(lang);
    }

    toggleLanguage(): void {
        this.currentLang.next(this.currentLang.value === 'ru' ? 'en' : 'ru');
    }

    translate(key: string): string {
        const translation = this.translations[key];
        return translation ? translation[this.currentLang.value] : key;
    }
}