/*
 * Determine if given email already exists in asp membership tables.
 * 
 */


import { AbstractControl } from '@angular/forms';
import { SignupService } from '../_services/signup.service';
import { map } from 'rxjs/operators';

export class ValidateEmailNotTaken {

 // not working

  // static createValidator(signupService: SignupService) {
    
  //   return (control: AbstractControl) => {
  //     return signupService.checkEmailNotTaken(control.value).pipe(
  //     map(res => {
  //       return !res ? null : { emailTaken: true };
  //     }));
  //   };
  // }
}