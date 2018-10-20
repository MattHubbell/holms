import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'enumKeys'})
export class EnumKeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    for (let enumMember in value) {
      let isValueProperty:boolean = (parseInt(enumMember, 10) >= 0);
      let enumKey:number = parseInt(enumMember, 10);
      if (isValueProperty) {
        keys.push({key: enumKey, value: value[enumMember]});
      } 
    }
    return keys;
  }
}
