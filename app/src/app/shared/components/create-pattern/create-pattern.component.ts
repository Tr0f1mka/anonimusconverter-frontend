import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormArray, FormGroup, Validator, Validators, AbstractControl } from "@angular/forms";
import { CustomValidators } from "src/app/core/validators/custom-validators";
import { NewPattern, NewModification } from "src/app/core/models/pattern.model";
import { PatternService } from "src/app/core/services/pattern.service";
import { AuthService } from "src/app/core/services/auth.service";
import { ModalService } from "src/app/core/services/modal.service";
import { LanguageService } from "src/app/core/services/language.service";
import { ChangeDetectorRef } from "@angular/core";

@Component({
    selector: "create-pattern-modal",
    templateUrl: "create-pattern.component.html",
    styleUrl: "create-pattern.component.css"
})
export class CreatePatternComponent {
    @Output() isOpenChange = new EventEmitter<boolean>();

    isOpen: boolean = false;
    createPatternForm: FormGroup;
    isLoading: boolean = false;

    types = ['String', 'Integer', 'Float', 'Boolean', null];
    selectedType: string | null = null;
    isOpenDropdown: boolean = false;

    constructor(
        private fb: FormBuilder,
        private patternService: PatternService,
        private authService: AuthService,
        private modalService: ModalService,
        private languageService: LanguageService,
        private cdr: ChangeDetectorRef
    ){
        this.createPatternForm = this.fb.group({
            userId: [''],
            name: ['', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
                CustomValidators.setNull()
            ]],
            modifications: this.fb.array([], CustomValidators.minModificationsLength())
        });
    }

    openForm() {
        if (!this.authService.isLoggedInSync()) {
            this.modalService.open({
                id: 'auth-required',
                title: this.languageService.translate('authRequired'),
                content: [this.languageService.translate('authRequiredDescription')],
                type: 'warning',
                size: 'small'
            });
            return;
        }
        this.isOpen = true;
    }

    get modifications(): FormArray {
        return this.createPatternForm.get('modifications') as FormArray;
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
                CustomValidators.defaultValueType()
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
        const errors = this.createPatternForm.get('modifications')?.errors;
        return errors?.['groupErrors']?.some((item: any) => item.errors?.[error]) || false;

    };

    onSubmit(): void {
        if (this.createPatternForm.valid) {
            if (this.isLoading) {
                
            }
            this.isLoading = true;
            
            const pattern = this.createPatternForm.value;
            // console.log('azaza', pattern);
            this.patternService.createPattern(pattern).subscribe({
                next: () => {
                    console.log("CREATE PATTERN: SUCCES");
                    this.isLoading = false;
                    // this.modalService.open({
                    //     id: 'create-pattern-success',
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
                        title: this.languageService.translate('errorTitle'),
                        content: [error.message || this.languageService.translate('failedRegister')],
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
        this.createPatternForm.reset();
        this.modifications.clear();
        this.isOpenChange.emit(false);
        this.cdr.detectChanges();
    }
}