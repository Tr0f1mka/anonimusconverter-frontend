import { Component, Input, Output, EventEmitter } from "@angular/core";
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
    @Input() isOpen: boolean = false;
    @Input() pattern: Pattern = {id: '', name: '', modifications: []};
    @Output() isOpenChange = new EventEmitter<boolean>();

    updatePatternForm: FormGroup;
    isLoading: boolean = false;

    types = ['String', 'Integer', 'Float', 'Boolean', null];
    selectedType: string | null = null;
    isOpenDropdown: boolean = false;

    constructor(
        private fb: FormBuilder,
        private patternService: PatternService,
        private authService: AuthService,
        private modalService: ModalService
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

    ngOnChanges() {
        console.log(this.pattern);
        this.updatePatternForm.get('id')?.setValue(this.pattern.id);
        this.updatePatternForm.get('name')?.setValue(this.pattern.name);
        this.pattern.modifications.forEach(modification => {
            this.initModifications(modification);
        });
    }

    initModifications(modification: Modification): void {
        this.modifications.push(
            this.fb.group({
                id: [modification.id],
                old_name: [modification.old_name, [
                    Validators.maxLength(50),
                    CustomValidators.setNull()
                ]],
                new_name: [modification.new_name, [
                    Validators.maxLength(50),
                    CustomValidators.setNull()
                ]],
                new_type: [modification.new_type, [
                    CustomValidators.setTypeValue()
                ]],
                new_value: [modification.new_value, [
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
            id: [null],
            old_name: [null, [
                Validators.maxLength(50),
                CustomValidators.setNull()
            ]],
            new_name: [null, [
                Validators.maxLength(50),
                CustomValidators.setNull()
            ]],
            new_type: [null, [
                CustomValidators.setTypeValue()
            ]],
            new_value: [null, [
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
        modificationGroup.get('new_type')?.setValue(event);

    }

    getTypeName(i: number): string | null {
        return this.modifications.at(i).get('new_type')?.value;
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