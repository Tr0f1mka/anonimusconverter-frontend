import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ModalComponent } from './components/modal/modal.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { FormatSelectorComponent } from './components/format-selector/format-selector.component';
import { TemplateSelectorComponent } from './components/template-selector/template-selector.component';
import { TranslatePipe } from './pipes/translate.pipe';

@NgModule({
  declarations: [
    ModalComponent,
    LanguageSwitcherComponent,
    FormatSelectorComponent,
    TemplateSelectorComponent,
    TranslatePipe
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
    TemplateSelectorComponent,
    TranslatePipe
  ]
})
export class SharedModule { }