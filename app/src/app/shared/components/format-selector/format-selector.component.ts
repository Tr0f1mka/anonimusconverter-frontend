import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';
import { FormatInfo, OUTPUT_FORMATS, FileFormat } from '../../../core/models/format.model';

@Component({
  selector: 'app-format-selector',
  templateUrl: 'format-selector.component.html',
  styleUrl: 'format-selector.component.css'
})
export class FormatSelectorComponent {
  @Input() sourceFormat: string = '?';
  @Input() selectedFormat: FormatInfo | null = null;
  @Output() formatChange = new EventEmitter<FormatInfo>();
  
  isOpen = false;
  availableFormats = OUTPUT_FORMATS;
  
  constructor(private elementRef: ElementRef) {}
  
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }
  
  selectFormat(format: FormatInfo): void {
    this.selectedFormat = format;
    this.formatChange.emit(format);
    this.isOpen = false;
  }
  
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }
}