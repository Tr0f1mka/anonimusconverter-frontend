import { Component, Input, Output, EventEmitter, HostListener, ElementRef } from '@angular/core';

@Component({
    selector: 'type-selector',
    templateUrl: 'type-selector.component.html',
    styleUrl: 'type-selector.component.css'
})
export class TypeSelectorComponent {
    @Input() selectedType: string | null = null;
    @Output() typeChange = new EventEmitter<string | null>();
    
    types = [null, 'String', 'Integer', 'Float', 'Boolean']
    isOpen = false;
    
    constructor(private elementRef: ElementRef) {}
    
    toggleDropdown(): void {
        this.isOpen = !this.isOpen;
    }
    
    selectType(type: string | null): void {
        this.selectedType = type;
        this.typeChange.emit(type);
        this.isOpen = false;
    }
    
    @HostListener('document:click', ['$event'])
    onClickOutside(event: MouseEvent): void {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.isOpen = false;
        }
    }
}