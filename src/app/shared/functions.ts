export function castNumber(value:any): number {
    return ((typeof value === 'string') ? parseInt((value.length > 0) ? value : '0') : value);
}

export function oldcamelCase(value:string): string {
    let outputString:string = '';
    let values = value.split(' ');
    for (let i = 0, len = values.length; i < len; i++) {
        if ((values[i].charAt(0) == 'I' || values[i].charAt(0) == 'V') && values[i].slice(1).length <= 3) {
            // outputString += values[i].toUpperCase() + ' ';
            outputString += values[i].toUpperCase();
        } else {
            // outputString += values[i].charAt(0).toUpperCase() + values[i].slice(1).toLowerCase() + ' ';
            outputString += values[i].charAt(0).toUpperCase() + values[i].slice(1).toLowerCase();
        }
    }
    // outputString = outputString.trim() + ' ';
    return outputString;
}

export function camelCase(value:string): string {
    let outputString:string = '';
    let lastSpace = 0;
    for (let i = 0, len = value.length; i < len; i++) {
        if (i == 0) {
            outputString += value[i].charAt(0).toUpperCase();
        }
        else {
            if (value[i].charAt(0) == ' ') {
                lastSpace = i;
            }
            if (value[(i - 1)].charAt(0) == ' ') {
                outputString += value[i].charAt(0).toUpperCase();
            } else {
                if ((value[(i - 1)].charAt(0) == 'I' || value[(i - 1)].charAt(0) == 'V' || value[(i - 1)].charAt(0) == 'M') && (value.trim().length - lastSpace) <= 4) {
                    outputString += value[i].charAt(0).toUpperCase();
                } else {
                    outputString += value[i].charAt(0).toLowerCase();
                }
            }
        }
    }
    return outputString;
}

import { format } from 'libphonenumber-js';

export function toFormatPhone(value:any, model:any, fieldName:string) {
    setTimeout( () => {
        if (value.length != 10 ) {
            model[fieldName] = format(value, 'International');
        }
        else {
            model[fieldName] = format(value, 'US', 'National');
        }
    });
}

export function toUppercase(value:any, model:any, fieldName:string) {
    setTimeout( () => {
        model[fieldName] = String(value).toUpperCase();
    });
}

export function toCamelCase(value:string, model:any, fieldName:string) {
    setTimeout( () => {
        model[fieldName] = camelCase(value);
    });
}

export function toCheckDate(date:string, model:any, fieldName:string) {
    setTimeout( () => {
        model[fieldName] = date;
    });
}
