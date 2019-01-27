import { Directive, Input } from '@angular/core';
import { NG_ASYNC_VALIDATORS, Validator, AbstractControl } from '@angular/forms';
import { FirebaseService } from '../firebase/firebase.service';

export async function validateThisId(tableName:string, columnName:string, isKey:boolean, firebaseService:FirebaseService, control: AbstractControl, uppercaseRequired: boolean) {
    if (!control.value) return null;
    if (!isKey) return null;
    if (control.pristine) return null;
    let value:string = control.value;
    if (uppercaseRequired) {
        value = value.toUpperCase();
    }
    const id:any = await firebaseService.getItemsAsync(tableName, columnName, value);
    return id.length ? {asyncInvalid: true} : null;
}

@Directive({
    selector: '[validate-id]',
    providers: [{provide: NG_ASYNC_VALIDATORS, useExisting: ValidateIdDirective, multi: true}]
  })
  export class ValidateIdDirective implements Validator {

    @Input() tableName: string;
    @Input() columnName: string;
    @Input() isKey: boolean;
    @Input() uppercaseRequired: boolean;

    constructor(
        private firebaseService: FirebaseService
    ) {
    }

    validate(control: AbstractControl): {[key: string]: any} | null {
        const val = validateThisId(this.tableName, this.columnName, this.isKey, this.firebaseService, control, this.uppercaseRequired);
        return val;
    }
}
