import { Pipe, PipeTransform } from '@angular/core';
import { format, ParsedNumber } from 'libphonenumber-js';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(inputValue: any, args?: string): any {
    let value:string = inputValue.toString();
    if (!value) {
      return value;
    }
      return format(value, 'US', 'National');
    }
}

