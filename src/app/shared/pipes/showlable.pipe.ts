import { Pipe, PipeTransform } from '@angular/core';
import { isNullOrUndefined } from 'util';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | showLable:valueProp
 * Example:
 *   {{ "sdsfsd" | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'showLable'})
export class showLablePipe implements PipeTransform {
  transform(value: string, valueProp?: string, lableProp?: string, sourceArray?: any[],isMultiSelect:boolean = false): string {
    if(isMultiSelect){
      let valueArray = value.split(",");
      let responseArray = [];
      valueArray.forEach((x) => {
        let a = sourceArray.find(y => y[valueProp] == x);
        if(a){
          responseArray.push(a[lableProp]);
        }       
      });
      return responseArray.join(',');
    }else{
      let object =  sourceArray.find(x => x[valueProp] == value);
      if(!isNullOrUndefined(object)){
        return object[lableProp];
      }
    }
  
  }
}