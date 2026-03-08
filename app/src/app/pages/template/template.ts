import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template.html',
  styleUrls: ['./template.css']
})
export class TemplatePage {
  templates = ['Базовый', 'Премиум', 'Профессиональный'];
  
  selectTemplate(template: string) {
    console.log('Выбран шаблон:', template);
  }
}