import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModalConfig } from '../models/modal.model';

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    private modals = new BehaviorSubject<ModalConfig[]>([]);

    get modals$(): Observable<ModalConfig[]> {
        return this.modals.asObservable();
    }

    open(config: ModalConfig): void {
        const currentModals = this.modals.value;
        // Проверяем, нет ли уже модалки с таким ID
        if (!currentModals.find(m => m.id === config.id)) {
            this.modals.next([...currentModals, config]);
        }
    }

    close(id: string): void {
        this.modals.next(this.modals.value.filter(m => m.id !== id));
    }

    closeAll(): void {
        this.modals.next([]);
    }
}