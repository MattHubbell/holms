import { Pipe, PipeTransform } from '@angular/core';
import * as f from './functions';

@Pipe({
  name: 'camelCase'
})
export class CamelCasePipe implements PipeTransform {

  transform(inputValue: string): string {
    if (!inputValue) {
      return inputValue;
    }
      return f.camelCase(inputValue);
    }
}

