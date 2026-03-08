import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root', // Этот селектор используется в index.html (<app-root>)
  standalone: true,     // Обязательно для нового подхода
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive], // Что используем в шаблоне
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  // Экспортируем класс с именем AppComponent
  title = 'anonimys_frontend';
  
  // Методы компонента (пока пусто)
}