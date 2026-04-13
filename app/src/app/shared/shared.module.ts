import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ModalComponent } from './components/modal/modal.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { FormatSelectorComponent } from './components/format-selector/format-selector.component';
import { PatternSelectorComponent } from './components/pattern-selector/pattern-selector.component';
import { TranslatePipe } from './pipes/translate.pipe';
import { ShowPatternComponent } from './components/show-pattern/show-pattern.component';
import { CreatePatternComponent } from './components/create-pattern/create-pattern.component';
import { UpdatePatternComponent } from './components/update-pattern/update-pattern.component';
import { TypeSelectorComponent } from './components/type-selector/type-selector.component';

@NgModule({
    declarations: [
        ModalComponent,
        LanguageSwitcherComponent,
        FormatSelectorComponent,
        PatternSelectorComponent,
        TranslatePipe,
        ShowPatternComponent,
        CreatePatternComponent,
        UpdatePatternComponent,
        TypeSelectorComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        ModalComponent,
        LanguageSwitcherComponent,
        FormatSelectorComponent,
        PatternSelectorComponent,
        TranslatePipe,
        ShowPatternComponent,
        CreatePatternComponent,
        UpdatePatternComponent,
        TypeSelectorComponent
    ]
})
export class SharedModule { }