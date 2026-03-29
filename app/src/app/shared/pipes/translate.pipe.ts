import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { LanguageService } from '../../core/services/language.service';
import { Subscription } from 'rxjs';

@Pipe({
    name: 'translate',
    pure: false // Нечистый pipe для обновления при смене языка
})
export class TranslatePipe implements PipeTransform, OnDestroy {
    private value = '';
    private langChangeSub: Subscription;

    constructor(
        private languageService: LanguageService,
        private ref: ChangeDetectorRef
    ) {
        this.langChangeSub = this.languageService.currentLanguage$.subscribe(() => {
            this.value = ''; // Инвалидируем кэш
            this.ref.markForCheck(); // Запускаем проверку изменений
        });
    }

    transform(key: string): string {
        if (!key) return '';
        
        // Если значение изменилось, запрашиваем новый перевод
        if (!this.value) {
            this.value = this.languageService.translate(key);
        }
        
        return this.value;
    }

    ngOnDestroy() {
        if (this.langChangeSub) {
            this.langChangeSub.unsubscribe();
        }
    }
}