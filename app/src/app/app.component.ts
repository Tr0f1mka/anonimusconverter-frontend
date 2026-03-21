import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ModalService } from './core/services/modal.service';
import { Observable } from 'rxjs';
import { ModalConfig } from './core/models/modal.model';

@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
    
    <!-- Глобальные модальные окна -->
    <ng-container *ngFor="let modal of modals$ | async">
      <app-modal 
        [title]="modal.title"
        [size]="modal.size || 'medium'"
        (close)="closeModal(modal.id)">
        <div *ngFor="let line of modal.content">
          <p>{{ line }}</p>
        </div>
      </app-modal>
    </ng-container>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  modals$: Observable<ModalConfig[]>;

  constructor(private modalService: ModalService) {
    this.modals$ = this.modalService.modals$;
    console.log('AppComponent инициализирован');
  }

  closeModal(id: string): void {
    this.modalService.close(id);
  }
}