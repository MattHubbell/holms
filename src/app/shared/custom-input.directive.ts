import { Directive, Input } from '@angular/core';
import * as f from './functions';

@Directive({
  selector: '[customInput]',
  host: {
    '(input)': 'onChange($event)'
  }
})
export class CustomInputDirective {

  @Input('customInput') inputType: string;

  constructor() {}

  onChange($event: any) {
    let pos = $event.target.selectionStart;
    switch(this.inputType.toLowerCase()) {
      case 'uppercase':
        $event.target.value = String($event.target.value).toUpperCase(); 
        break;    
      case 'camelcase':
        $event.target.value = f.camelCase($event.target.value);
        break;    
      case 'phone':
        if ($event.target.value.length == 10) {
            pos += 4;
        }
        $event.target.value = f.phone($event.target.value);
        break;    
    }
    $event.target.selectionStart = pos;
    $event.target.selectionEnd = pos;
  }
}
