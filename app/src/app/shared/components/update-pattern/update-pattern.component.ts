import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormArray, FormGroup, Validator, Validators, AbstractControl } from "@angular/forms";
import { CustomValidators } from "src/app/core/validators/custom-validators";
import { Modification, Pattern, UpdateModification, UpdetePattern } from "src/app/core/models/pattern.model";
import { PatternService } from "src/app/core/services/pattern.service";
import { AuthService } from "src/app/core/services/auth.service";
import { ModalService } from "src/app/core/services/modal.service";

@Component({
    selector: "update-pattern-modal",
    templateUrl: "update-pattern.component.html",
    styleUrl: "update-pattern.component.css"
})
export class UpdatePatternComponent {
    @Input() pattern: Pattern = {id: '', name: ''};
    @Output() isOpenChange = new EventEmitter<boolean>();

    isOpen: boolean = false;

    updatePatternForm: FormGroup;
    isLoading: boolean = false;

    types = ['String', 'Integer', 'Float', 'Boolean', null];
    selectedType: string | null = null;
    isOpenDropdown: boolean = false;

    constructor(
        private fb: FormBuilder,
        private patternService: PatternService,
        private authService: AuthService,
        private modalService: ModalService,
        private cdr: ChangeDetectorRef
    ){
        this.updatePatternForm = this.fb.group({
            id: [''],
            name: ['', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
                CustomValidators.setNull()
            ]],
            modifications: this.fb.array([], CustomValidators.minModificationsLength())
        });
    }

    openWindow(): void {
        this.patternService.getModifications(this.pattern.id, 100, 1).subscribe({
            next: (modifications) => {
                this.updatePatternForm.setControl('modifications',
                    this.fb.array([], CustomValidators.minModificationsLength())
                );
                modifications.forEach(modification => {
                    this.initModifications(modification);
                });
                this.updatePatternForm.get('id')?.setValue(this.pattern.id);
                this.updatePatternForm.get('name')?.setValue(this.pattern.name);
                this.cdr.detectChanges();
                this.isOpen = true;
            },
            error: (error) => {
                console.error('Failed to load modifications', error);
                this.modifications.clear();
                this.modalService.open({
                    id: 'open-pattern-modal',
                    title: 'Ошибка',
                    content: ['Ошибка загрузки модификаций шаблона'],
                    type: 'info',
                    size: 'small'
                });
            }
        });
    }

    initModifications(modification: Modification): void {
        this.modifications.push(
            this.fb.group({
                oldName: [modification.oldName, [
                    Validators.maxLength(50),
                    CustomValidators.setNull()
                ]],
                newName: [modification.newName, [
                    Validators.maxLength(50),
                    CustomValidators.setNull()
                ]],
                newType: [modification.newType, [
                    CustomValidators.setTypeValue()
                ]],
                newValue: [modification.newValue, [
                    Validators.maxLength(50),
                    CustomValidators.setNull()
                ]]
            }, {
                validators: [
                    CustomValidators.oldNewValue(),
                    CustomValidators.defaultValueType(),
                    CustomValidators.requiredArgument()
                ]
            })
        );
    }

    get modifications(): FormArray {
        return this.updatePatternForm.get('modifications') as FormArray;
    }

    createModificationGroup(): FormGroup {
        return this.fb.group({
            oldName: [null, [
                Validators.maxLength(50),
                CustomValidators.setNull()
            ]],
            newName: [null, [
                Validators.maxLength(50),
                CustomValidators.setNull()
            ]],
            newType: [null, [
                CustomValidators.setTypeValue()
            ]],
            newValue: [null, [
                Validators.maxLength(50),
                CustomValidators.setNull()
            ]]
        }, {
            validators: [
                CustomValidators.oldNewValue(),
                CustomValidators.defaultValueType(),
                CustomValidators.requiredArgument()
            ]
        });
    }

    addModification(): void {
        this.modifications.push(this.createModificationGroup());
    }

    removeModification(i: number): void {
        this.modifications.removeAt(i);
    }

    selectType(event: string | null, i: number): void{
        console.log(event, i);
        
        const modificationGroup = this.modifications.at(i) as FormGroup;
        modificationGroup.get('newType')?.setValue(event);

    }

    getTypeName(i: number): string | null {
        return this.modifications.at(i).get('newType')?.value;
    }

    isFieldInvalid(form: FormGroup, fieldName: string): boolean {
        const field = form.get(fieldName);
        return field ? field.invalid && field.touched : false;
    }

    hasGroupError(error: string): boolean {
        const errors = this.updatePatternForm.get('modifications')?.errors;
        return errors?.['groupErrors']?.some((item: any) => item.errors?.[error]) || false;

    };

    onSubmit(): void {
        if (this.updatePatternForm.valid) {
            this.isLoading = true;
            
            const pattern = this.updatePatternForm.value;
            console.log('azaza', pattern);
            this.patternService.updatePattern(pattern).subscribe({
                next: () => {
                    this.isLoading = false;
                    // this.modalService.open({
                    //     id: 'update-pattern-success',
                    //     title: 'Успех',
                    //     content: ['Создание шаблона прошло успешно! Теперь вы можете его использовать'],
                    //     type: 'info',
                    //     size: 'small'
                    // });
                    this.closeModal();
                },
                error: (error) => {
                    this.isLoading = false;
                    this.modalService.open({
                        id: 'register-error',
                        title: 'Ошибка',
                        content: [error.message || 'Не удалось зарегистрироваться'],
                        type: 'warning',
                        size: 'small'
                    });
                }
            });
        }
    }

    closeModal(): void {
        //Закрытие модалки
        this.isOpen = false;
        this.updatePatternForm.reset();
        this.modifications.clear();
        this.isOpenChange.emit(false);
    }
}