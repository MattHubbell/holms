import { Component, ViewEncapsulation, Input, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as f from './functions';

@Component({
    selector: 'input-custom',
    templateUrl: './input-custom.component.html',
    encapsulation: ViewEncapsulation.None
})
export class InputCustomComponent implements OnInit {

    @Input() fieldType: string;
    @Input() fieldName: string;
    @Input() placeholderText: string;
    @Input() model: any;
    @Input() value: any;
    @Input() isRequired: boolean;
    @Input() isKey: boolean;
    @Input() errorMessage: string;
    @Input() tableName: string;
    @Input() maxLength: number;

    @ViewChild('inputRef') inputRef: ElementRef;

    showHint: boolean;

    ngOnInit() {
        if (this.maxLength == 0) {
            this.showHint = false;
            this.maxLength = 2000;
        }
        else {
            this.showHint = true;
        }
    }

    onChange(value, model, field) {
        if (this.fieldType.toLowerCase() == 'email') return;
        const pos = this.inputRef.nativeElement.selectionStart;
        switch(this.fieldType.toLowerCase()) {
            case 'uppercase':
                f.toUppercase(value, model, field);
                break;    
            case 'camelcase':
                f.toCamelCase(value, model, field);
                break;    
            case 'phone':
                f.toFormatPhone(value, model, field);
                break;    
        }
        setTimeout(() => {
            this.inputRef.nativeElement.selectionStart = pos;
            this.inputRef.nativeElement.selectionEnd = pos;
        });
    }
}
