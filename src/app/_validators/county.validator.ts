/*
 * Is a given county found in flex?
 * Need to verify to load tax rates for a dealer.
 * 
 */

import { AbstractControl } from '@angular/forms';
import { SignupService } from '../_services/signup.service';
import { map } from 'rxjs/operators';

export class ValidateCountyExists {

  // 09.12.2018 note being used
  static createValidator(signupService: SignupService) {
    
    return (control: AbstractControl) => {
      return signupService.getCounty(control.value).pipe(
      map(res => {
        return res ? null : { countyExists: false };
      }));
    };
  }
}