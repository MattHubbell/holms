declare var $ :any;

export function clone(object:any) {
    return $.extend(true, {}, object);
}

export function castNumber(value: any): number {
    return ((typeof value === 'string') ? parseInt((value.length > 0) ? value : '0') : value);
}

export function camelCase(value: string): string {
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

export function phone(value: string): string {
    let formattedPhone: string = value;
    if (value[0] != "+") {
        if (value.length == 10) {
            for (let i = 0, len = value.length; i < len; i++) {
                if (i == 0) {
                    formattedPhone = '(' + value[i];        
                } else {
                    if (i == 3) {
                        formattedPhone += ') ' + value[i];
                    } else {
                        if (i == 6) {
                            formattedPhone += '-' + value[i];
                        } else {
                            formattedPhone += value[i]
                        }
                    }
                } 
            }
        } else {
            formattedPhone = value.replace('(', '').replace(')', '').replace('-','').replace(' ', '');
        }
    }
    return formattedPhone;
}

export function toDatabaseDate(date: any) : string {
    if (typeof date === 'string')   {
        return date;
    } else {
        return date.toISOString();
    }
}

export function pad(num: number, size: number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}
