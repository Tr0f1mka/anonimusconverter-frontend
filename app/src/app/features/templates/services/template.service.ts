import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Template, TemplateResponse } from '../../../core/models/template.model';
import { APIPathes } from 'src/app/api-pathes';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {
  private apiUrl = APIPathes.templates;

  constructor(private http: HttpClient) {}

  getTemplates(): Observable<TemplateResponse> {
    // Взятие шаблонов
    return this.http.get<TemplateResponse>(this.apiUrl);
    
    // Заглушка (для селектора на главнной странице)
    // return of({
    //   templates: [
    //     { id: '1', name: 'Шаблон1' },
    //     { id: '2', name: 'Шаблон2' },
    //     { id: '3', name: 'Шаблон3' }
    //   ],
    //   total: 3
    // });
  }

  getTemplateById(id: string): Observable<Template> {
    // Взятие шаблона по ID
    return this.http.get<Template>(`${this.apiUrl}/${id}`);
    
    // return of({
    //   id: id,
    //   name: 'Шаблон ' + id
    // });
  }

  createTemplate(template: Partial<Template>): Observable<Template> {
    // Создание нового шаблона
    return this.http.post<Template>(this.apiUrl, template);
    
    // return of({
    //   id: Math.random().toString(36).substring(7),
    //   name: template.name || 'Новый шаблон'
    // });
  }

  updateTemplate(id: string, template: Partial<Template>): Observable<Template> {
    // Обновление шаблона (изменение пользователем)
    return this.http.put<Template>(`${this.apiUrl}/${id}`, template);
    
    // return of({
    //   id: id,
    //   name: template.name || 'Обновленный шаблон',
    // });
  }

  deleteTemplate(id: string): Observable<void> {
    // Удаление шаблона
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
    
    // return of(void 0);
  }
}