import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FormBuilder, FormArray, FormGroup, Validator, Validators } from "@angular/forms";
import { CustomValidators } from "src/app/core/validators/custom-validators";
import { NewPattern, NewModification } from "src/app/core/models/pattern.model";
import { PatternService } from "src/app/core/services/pattern.service";
import { AuthService } from "src/app/core/services/auth.service";

@Component({
    selector: "create-pattern-modal",
    templateUrl: "create-pattern.component.html",
    styleUrl: "create-pattern.component.css"
})
export class CreatePatternComponent {
    @Input() isOpen: boolean = false;
    @Output() isOpenChange = new EventEmitter<boolean>();

    createPatternForm: FormGroup;
    types = ['String', 'Integer', 'Float', 'Boolean', null];

    constructor(
        private fb: FormBuilder,
        private patternService: PatternService,
        private authService: AuthService
    ){
        this.createPatternForm = this.fb.group({
            userId: [this.authService.getCurrentUserSync()?.id],
            name: ['', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(50),
                CustomValidators.noLeadingTrailingSpaces,
                CustomValidators.setNull()
            ]],
            modifications: this.fb.array([])
        }, {
            validators: CustomValidators.minModificationsLength
        });
    }

    get modifications(): FormArray {
        return this.createPatternForm.get('modifications') as FormArray;
    }

    createModificationGroup(): FormGroup {
        return this.fb.group({
            old_name: [null, [
                Validators.maxLength(50),
                CustomValidators.noLeadingTrailingSpaces,
                CustomValidators.setNull()
            ]],
            new_name: [null, [
                Validators.maxLength(50),
                CustomValidators.noLeadingTrailingSpaces,
                CustomValidators.setNull()
            ]],
            new_type: [null, [
                CustomValidators.setTypeValue()
            ]],
            new_value: [null, [
                Validators.maxLength(50),
                CustomValidators.noLeadingTrailingSpaces,
                CustomValidators.setNull()
            ]]
        }, {
            validators: [
                CustomValidators.oldNewValue,
                CustomValidators.defaultValueType,
                CustomValidators.requiredArgument
            ]
        });
    }

    addModification(): void {
        this.modifications.push(this.createModificationGroup());
    }

    removeModification(i: number): void {
        this.modifications.removeAt(i);
    }

    isFieldInvalid(form: FormGroup, fieldName: string): boolean {
        const field = form.get(fieldName);
        return field ? field.invalid && field.touched : false;
    }

    onSubmit(): void {
        console.log('azaza');
        console.log(this.createPatternForm.value);
    }

    closeModal(): void {
        //Закрытие модалки
        this.isOpen = false;
        this.isOpenChange.emit(false);
    }
}