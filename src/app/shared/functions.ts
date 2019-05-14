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
            const cc:string = value[(i)].charAt(0); // current character in value
            if (cc == ' ') {
                lastSpace = i;
            }
            const pc:string = value[(i - 1)].charAt(0); // previous character in value
            if (pc == ' ') {
                outputString += cc.toUpperCase();
            } else {
                if ((pc == '-') || (pc == '/') || ((pc == 'I' || pc == 'V' || pc == 'M'  || pc == 'D') && (value.trim().length - lastSpace) <= 4)) {
                    outputString += cc.toUpperCase();
                } else {
                    outputString += cc.toLowerCase();
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
