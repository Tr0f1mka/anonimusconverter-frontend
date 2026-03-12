import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: 'modal.component.html',
  styleUrl: 'modal.component.css'
})
export class ModalComponent {
  @Input() title = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showFooter = true;
  @Input() closeOnOverlayClick = true;
  @Input() customStyles: { [key: string]: string } = {};
  
  @Output() close = new EventEmitter<void>();

  @HostListener('document:keydown.escape')
  onEscapePress() {
    this.close.emit();
  }

  onOverlayClick(event: MouseEvent) {
    if (this.closeOnOverlayClick && (event.target as HTMLElement).classList.contains('modal-overlay')) {
      this.close.emit();
    }
  }
}