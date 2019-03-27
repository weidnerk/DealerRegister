/*
  Main dealer profile entry page

*/
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { CMSCompany } from '../_models/company';
import { Contact } from '../_models/contact';
import { CompanyProfile } from '../_models/companyprofile';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSelectChange, MatOption } from '@angular/material';

import { map } from 'rxjs/operators';
import { DealerParamService } from '../_services/dealerparam.service'
import { DealerService } from '../_services/dealer.service'
import { SignupService } from '../_services/signup.service';
import { ValidateEmailNotTaken } from '../_validators/email.validator'
import { ValidateCountyExists } from '../_validators/county.validator'
import { MatSelectModule } from '@angular/material';

//const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const FIRSTNAME_REGEX = /^[a-zA-Z]+$/;
const LASTNAME_REGEX = /^[a-zA-Z ']+$/;
//const LASTNAME_REGEX = "[a-zA-Z][a-zA-Z ]+";  // can have a space
const DEALER_REGEX = /^[0-9a-zA-Z. ]+$/;

@Component({
  selector: 'app-dealerreactive',
  templateUrl: './dealerreactive.component.html',
  styleUrls: ['./dealerreactive.component.scss']
})
export class DealerReactiveComponent implements OnInit {

  // was using Angular's [Validators.email] to validate dealer's email address
  // but this allows atypical email addresses (although technically correct)
  //  see for reference
  // https://stackoverflow.com/questions/23671934/form-validation-email-validation-not-working-as-expected-in-angularjs
  //
  // so came up with pattern instead
  emailPattern = "^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$";
  // trick is to test for this error properly:
  //  <mat-error *ngIf="email.hasError('pattern')>

  ReferredByValues = [
    { value: '1', viewValue: 'Field Agent' },
    { value: '2', viewValue: 'Inside Marketing Agent' },
    { value: '3', viewValue: 'Referral from Current Client' },
    { value: '4', viewValue: 'Referral from Frazer' },
    { value: '5', viewValue: 'Other' }
  ];

  // DMSValues = [
  //   { value: '0', viewValue: 'Frazer', icon: 'wricon' },
  //   { value: '1', viewValue: 'Wayne Reaves', icon: 'wricon' },
  //   { value: '2', viewValue: 'Auto Star Solutions', icon: 'wricon' },
  //   { value: '3', viewValue: 'Dealer Center', icon: 'wricon' },
  //   { value: '4', viewValue: 'Finance Express', icon: 'wricon' },
  //   { value: '5', viewValue: 'Other', icon: 'wricon' }
  // ];
  DMSValues = [
    { value: '6', viewValue: 'Frazer', icon: 'frazericon' },
    { value: '7', viewValue: 'Wayne Reaves', icon: 'wricon' },
    { value: '2', viewValue: 'Auto Star Solutions', icon: 'dmsstubicon' },
    { value: '5535', viewValue: 'Dealer Center', icon: 'dmsstubicon' },
    { value: '5', viewValue: 'Finance Express', icon: 'dmsstubicon' },
    { value: '8', viewValue: 'Other', icon: 'dmsstubicon' }
  ];

  states = [
    { value: 'AL', viewValue: 'AL' },
    { value: 'AR', viewValue: 'AR' },
    { value: 'AZ', viewValue: 'AZ' },
    { value: 'CA', viewValue: 'CA' },
    { value: 'CO', viewValue: 'CO' },
    { value: 'CT', viewValue: 'CT' },
    { value: 'DE', viewValue: 'DE' },
    { value: 'FL', viewValue: 'FL' },
    { value: 'GA', viewValue: 'GA' },
    { value: 'IA', viewValue: 'IA' },
    { value: 'ID', viewValue: 'ID' },
    { value: 'IL', viewValue: 'IL' },
    { value: 'IN', viewValue: 'IN' },
    { value: 'KS', viewValue: 'KS' },
    { value: 'KY', viewValue: 'KY' },
    { value: 'LA', viewValue: 'LA' },
    { value: 'MD', viewValue: 'MD' },
    { value: 'ME', viewValue: 'ME' },
    { value: 'MI', viewValue: 'MI' },
    { value: 'MN', viewValue: 'MN' },
    { value: 'MS', viewValue: 'MS' },
    { value: 'NC', viewValue: 'NC' },
    { value: 'NE', viewValue: 'NE' },
    { value: 'NH', viewValue: 'NH' },
    { value: 'NJ', viewValue: 'NJ' },
    { value: 'NM', viewValue: 'NM' },
    { value: 'NV', viewValue: 'NV' },
    { value: 'OH', viewValue: 'OH' },
    { value: 'OK', viewValue: 'OK' },
    { value: 'OR', viewValue: 'OR' },
    { value: 'PA', viewValue: 'PA' },
    { value: 'RI', viewValue: 'RI' },
    { value: 'SC', viewValue: 'SC' },
    { value: 'SD', viewValue: 'SD' },
    { value: 'TN', viewValue: 'TN' },
    { value: 'TX', viewValue: 'TX' },
    { value: 'UT', viewValue: 'UT' },
    { value: 'VA', viewValue: 'VA' },
    { value: 'WA', viewValue: 'WA' },
    { value: 'WV', viewValue: 'WV' },
    { value: 'WY', viewValue: 'WY' }
  ];
  dealer = new CMSCompany();
  contact = new Contact();
  //dealer: CMSCompany;     // shared, service variable
  errorMessage: string;
  counties: string[];
  qryStrEmail: string;
  qryStrContactId: string;
  qryStrSupplied: boolean = false;
  contactId: number;
  selectedDMSText: string;

  dealerForm: FormGroup;
  constructor(private fb: FormBuilder,
    private dealerService: DealerService,
    private router: Router,
    private dealerParams: DealerParamService,
    private signupService: SignupService,
    private activatedRoute: ActivatedRoute,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer
  ) {
    this.matIconRegistry.addSvgIcon(
      'wricon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/WR_LOGO.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'frazericon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/Frazer_Logo.svg')
    );
    this.matIconRegistry.addSvgIcon(
      'dmsstubicon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/manuals.svg')
    );

    // this.matIconRegistry.addSvgIcon(
    //   'wricon',
    //   this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/manuals.svg')
    // );
    // this.matIconRegistry.addSvgIcon(
    //   'frazericon',
    //   this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/frazer.svg')
    // );
  }

  ngOnInit(): void {

    this.buildForm();

    this.activatedRoute.queryParamMap
      .subscribe((queryParams) => {

        // if we got a contactId on the query string
        if (queryParams.get('contactId')) {
          // console.log(queryParams.get('contactId'));
          // if (this.dealer) console.log('dealer defined') 
          // else console.log('dealer undefined');
          this.contactId = Number(queryParams.get('contactId'));
          this.dealerService.getCompanyFromContact(this.contactId).subscribe(
            dealer => {
              //console.log('finish call to getCompanyFromContact');
              this.qryStrSupplied = true;
              this.dealerParams.changeQryStrVal(true);
              this.dealer = dealer;
              this.dealerParams.changeDealer(this.dealer);
              this.setupForm();
            },
            error => this.errorMessage = <any>error);
        }
        else {
          // Wait for the param service to return a dealer (if there is one)
          // and then build the form
          this.dealerParams.currentDealer.subscribe(
            dealer => {
              this.dealer = dealer;
              this.dealerParams.currentQryStr.subscribe(qryStr => {
                this.qryStrSupplied = qryStr;

                this.signupService.getCounty(this.dealer.Zip)
                  .subscribe(x => {
                    this.counties = x;
                    this.setupForm();
                  },
                    error => {
                      this.errorMessage = error.errMsg;
                    });

              })
            })
        }
      });
  }

  setupForm() {

    // if dealer has already reviewed
    if (this.dealer.CompanyID != null) {
      if (this.dealer.CompanyID > 0) {

        if (!this.qryStrSupplied) {

        }
        else
          this.dealerForm.controls['email'].disable();

        // why is this null?
        //console.log('dms id: ' + this.dealer.CompanyProfile.DMSId);

        // if qrystr, click refresh, this.dealer has values?
        this.dealerForm.patchValue({
          dealername: this.dealer.CompanyName,
          firstName: this.getFirstName(this.dealer.Contacts[0].ContactName),// have to split contact name into first and last name
          lastName: this.getLastName(this.dealer.Contacts[0].ContactName),
          email: this.dealer.Contacts[0].Email,
          address: this.dealer.AddrLn1,
          address2: this.dealer.AddrLn2,
          city: this.dealer.City,
          state: this.dealer.State,
          phone: this.replaceAll(this.dealer.Phone, '-', ''),
          zip: this.dealer.Zip,
          submitFromDT: this.dealer.SubmitFromDT,
          DMSId: (this.dealer.CompanyProfile != null && this.dealer.CompanyProfile.DMSId != null) ? this.dealer.CompanyProfile.DMSId.toString() : null,
          DMSOther: this.dealer.DMSOther,
          referredById: (this.dealer.CompanyProfile != null && this.dealer.CompanyProfile.ReferredBy != null) ? this.dealer.CompanyProfile.ReferredBy.toString() : null,
          county: this.dealer.County,
          stateSalesTax: (this.dealer.DlrSaleTaxPer) ? Number(this.dealer.DlrSaleTaxPer) : null,
          countyTax: (this.dealer.DlrCntyTaxPer) ? Number(this.dealer.DlrCntyTaxPer) : null,
        });
        
        // need to set the text of the DMSId select control
        var dmsid = (this.dealer.CompanyProfile != null && this.dealer.CompanyProfile.DMSId != null) ? this.dealer.CompanyProfile.DMSId.toString() : null;
        if (dmsid) {
          this.selectedDMSText = this.DMSValues[this.DMSValueIndex(dmsid)].viewValue;
        }
        //this.dealerForm.controls['DMSId'].setValue('3');
        //this.dealerForm.controls['county'].setValue(this.dealer.County);

        // var x = (this.dealer.CompanyProfile != null && this.dealer.CompanyProfile.DMSId != null) ? this.dealer.CompanyProfile.DMSId.toString() : null;
        // if (x) {
        //   const toSelect = this.DMSValues.find(c => c.value == x);
        //   this.DMSId.get('DMSId').setValue(toSelect);
        // }
      }
    }
  }

  getFirstName(contact: string): string {
    var stringArray = contact.split(/(\s+)/);
    return stringArray[0];
  }
  getLastName(contact: string): string {
    var stringArray = contact.split(/(\s+)/);
    return stringArray[2];
  }

  // Note: this is a flat list of fields passed to the form - not a Company object
  buildForm(): void {

    this.dealerForm = this.fb.group({
      dealername: [null, {
        validators: [Validators.required, Validators.minLength(2), Validators.pattern(DEALER_REGEX)],
        updateOn: 'submit'
      }],
      firstName: [null, {
        validators: [Validators.required, Validators.minLength(2), Validators.pattern(FIRSTNAME_REGEX)],
        updateOn: 'submit'
      }],
      lastName: [null, {
        validators: [Validators.required, Validators.minLength(2), Validators.pattern(LASTNAME_REGEX)],
        updateOn: 'submit'
      }],
      email: [null, {
        validators: [Validators.required, Validators.pattern(this.emailPattern)],
        asyncValidators: [this.validateEmailNotTaken.bind(this)],
        updateOn: 'submit'
      }],
      address: [null, {
        validators: [Validators.required, Validators.minLength(2)],
        updateOn: 'submit'
      }],
      address2: [null],
      city: [null, {
        validators: [Validators.required, Validators.minLength(2)],
        updateOn: 'submit'
      }],
      state: [null, {
        validators: [Validators.required],
        updateOn: 'submit'
      }],
      zip: [null, {
        validators: [this.validateZip.bind(this)],
        asyncValidators: [this.validateCounty.bind(this)]
      }],
      phone: [null, {
        validators: [this.validatePhone.bind(this)],
        updateOn: 'submit'
      }],
      submitFromDT: [false,
        { updateOn: 'submit' }],
      DMSId: [null,
        { updateOn: 'submit' }],
      DMSOther: [null,
        { updateOn: 'submit' }],
      referredById: [null,
        { updateOn: 'submit' }],
      county: [null, {
        validators: [Validators.required],
        updateOn: 'submit'
      }],
      stateSalesTax: [null, {
        validators: [Validators.max(15), Validators.min(0)],
        updateOn: 'submit'
      }],
      countyTax: [null, {
        validators: [Validators.max(15), Validators.min(0)],
        updateOn: 'submit'
      }]
    })
  }

  validateCounty(c: AbstractControl): Observable<ValidationErrors | null> {

    if (c.value != undefined) {
      this.signupService.getCounty(c.value)
        .subscribe(x => {
          this.counties = x;
          if (this.counties.length == 1) {
            this.dealerForm.patchValue({
              county: this.counties[0]
            });
          }
          return null;
        },
          error => {
            this.errorMessage = error.errMsg;
          });
    }
    return of(null);
  };

  validateEmailNotTaken(control: AbstractControl) {

    return this.signupService.checkEmailNotTaken(control.value).pipe(
      map(res => {
        return !res ? null : { emailTaken: true };
      }));
  }

  // zip must be 5 digits long
  validateZip(c: AbstractControl): { [key: string]: boolean | null } {
    //console.log('zip ' + c.value);
    if (c.value === null) {
      return { error: true };
    }
    if (c.value != undefined) {
      this.dealerForm.controls['county'].setValue(null);
      let strLength: number = (<string>c.value).length;
      if (strLength != 5) {
        this.counties = null;
        return { error: true };
      }

      if (isNaN(c.value)) {
        this.counties = null;
        return { error: true };
      }
      else {
        return null;    // control is valid              
      }
    }
  }

  // Phone must be numeric and 10 digits long
  // Tried using type='tel' on mdInput, such as:
  // <input mdInput formControlName="phone" placeholder="Phone" type="tel">
  // but can't get it to work, so ended up creating this custome validator
  validatePhone(c: AbstractControl): { [key: string]: boolean | null } {

    if (c.value != undefined) {
      let strLength: number = (<string>c.value).length;
      if (strLength != 10)
        return { error: true };

      if (isNaN(c.value))
        return { error: true };

      return null;
    }
    return { error: true };
  }

  get dealername() { return this.dealerForm.get('dealername'); }
  get firstName() { return this.dealerForm.get('firstName'); }
  get lastName() { return this.dealerForm.get('lastName'); }
  get address() { return this.dealerForm.get('address'); }
  get address2() { return this.dealerForm.get('address2'); }
  get city() { return this.dealerForm.get('city'); }
  get county() { return this.dealerForm.get('county'); }
  get state() { return this.dealerForm.get('state'); }
  get email() { return this.dealerForm.get('email'); }
  get phone() { return this.dealerForm.get('phone'); }
  get zip() { return this.dealerForm.get('zip'); }
  get submitFromDT() { return this.dealerForm.get('submitFromDT'); }
  get DMSId() { return this.dealerForm.get('DMSId'); }
  get DMSOther() { return this.dealerForm.get('DMSOther'); }
  get referredById() { return this.dealerForm.get('referredById'); }
  get stateSalesTax() { return this.dealerForm.get('stateSalesTax'); }
  get countyTax() { return this.dealerForm.get('countyTax'); }

  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }

  getDMSNameFromID(id: number) {
    let name: string;
    switch (id) {
      case 8:
        name = 'Other';
        break;
      case 6:
        name = 'Frazer';
        break;
      case 7:
        name = 'Wayne Reeves';
        break;
      case 2:
        name = 'Auto Star Solutions';
        break;
      case 5535:
        name = 'Dealer Center';
        break;
      case 5:
        name = 'Finance Express';
        break;
      default:
        name = null;
    }
    return name;
  }

  onSubmit() {

    console.log(this.dealerForm.valid);
    if (!this.formIsValid())
      return;

    // --------------------------------------------------
    // Fill 'dealer' from form
    // --------------------------------------------------
    this.dealer.CreatedDate = new Date();
    this.dealer.CompanyName = this.dealername.value.trim();
    this.dealer.AddrLn1 = this.address.value.trim();
    this.dealer.AddrLn2 = (this.address2.value) ? this.address2.value.trim() : null;
    this.dealer.City = this.city.value.trim();
    this.dealer.State = this.state.value;
    this.dealer.Zip = this.zip.value;
    this.dealer.County = this.county.value;
    this.dealer.Phone = this.phone.value;
    this.dealer.SubmitFromDT = this.submitFromDT.value;

    // Did user select a DMS?
    if (this.DMSId.value != null) {
      if (this.dealer.CompanyProfile == null)   // the CMS dealer may not have a stored company profile yet
      {
        let p = new CompanyProfile();
        p.CompanyID = this.dealer.CompanyID;
        p.DMSId = Number(this.DMSId.value);
        this.dealer.CompanyProfile = p;
      }
      else {
        this.dealer.CompanyProfile.DMSId = Number(this.DMSId.value);
      }
      this.dealer.DMSName = this.getDMSNameFromID(this.dealer.CompanyProfile.DMSId);
    }
    this.dealer.DMSOther = this.DMSOther.value;

    // Did user select a "Referred By" value?
    if (this.referredById.value != null) {
      if (this.dealer.CompanyProfile == null) {
        let p = new CompanyProfile();
        p.CompanyID = this.dealer.CompanyID;
        p.ReferredBy = Number(this.referredById.value);
        this.dealer.CompanyProfile = p;
      }
      else {
        this.dealer.CompanyProfile.ReferredBy = Number(this.referredById.value);
      }
    }

    if (this.stateSalesTax.value)
      this.dealer.DlrSaleTaxPer = Number(this.stateSalesTax.value);
    else
      this.dealer.DlrSaleTaxPer = null;

    if (this.countyTax.value)
      this.dealer.DlrCntyTaxPer = Number(this.countyTax.value);
    else
      this.dealer.DlrCntyTaxPer = null;

    // fill contact
    if (this.dealer.CompanyID != null) {
      this.dealer.Contacts = [{
        ContactID: this.dealer.Contacts[0].ContactID,
        CompanyID: this.dealer.Contacts[0].CompanyID,
        Email: this.email.value,
        ContactName: this.firstName.value.trim() + ' ' + this.lastName.value.trim()
      }];
    }
    else {
      this.contact = new Contact();
      this.contact.ContactName = this.firstName.value.trim() + ' ' + this.lastName.value.trim();
      this.contact.Email = this.email.value;
      this.dealer.Contacts = [];
      this.dealer.Contacts.push(this.contact);
    }

    this.dealerService.postCompany(this.dealer).subscribe(
      data => {
        this.dealer = data;
        if (this.dealer.CompanyID > 0) {
          this.dealer.Phone = this.replaceAll(this.dealer.Phone, "-", "");
          if (this.dealer.CompanyProfile != null) { // dealer from CMS does not have DMSName property
            this.dealer.DMSName = this.getDMSNameFromID(this.dealer.CompanyProfile.DMSId);
          }
          this.dealerParams.changeDealer(this.dealer);
          this.router.navigate(['/dealerreview']);
        }
        else {
          this.errorMessage = "There was a problem creating your account - please call Mid-Atlantic.  Thank you.";
        }
      },
      error => {
        console.log('postCompany: ' + error);
        this.errorMessage = error
      }
      ,      // in case of failure show this message
      () => console.log("Job Done Post !")                  //run this code in all cases
    );
  }

  // Create our own 'form is valid' function so we can check when Submit button is clicked
  formIsValid(): boolean {

    // apparently these calls are not needed
    //this.firstName.updateValueAndValidity();
    //this.lastName.updateValueAndValidity();

    if (this.dealername.invalid) return false;
    if (this.firstName.invalid) return false;
    if (this.lastName.invalid) return false;
    if (this.email.invalid) return false;
    if (this.address.invalid) return false;
    if (this.address2.invalid) return false;
    if (this.city.invalid) return false;
    if (this.state.invalid) return false;
    if (this.zip.invalid) return false;
    if (this.county.invalid) return false;
    if (this.phone.invalid) return false;
    if (this.submitFromDT.invalid) return false;
    if (this.DMSId.invalid) return false;
    if (this.stateSalesTax.invalid) return false;
    if (this.countyTax.invalid) return false;
    return true;
  }

  selected(event: MatSelectChange) {
    const selectedData = {
      text: (event.source.selected as MatOption).viewValue,
      value: event.source.value
    }

    var i = this.DMSValueIndex(selectedData.value);
    this.selectedDMSText = this.DMSValues[i].viewValue;
    // this.foodForm.controls['foodName'].setValue(this.selectedText);
  }

  DMSValueIndex(dmsid: string) {
    var ret: number;
    switch (dmsid) {
      case "6": {
        ret = 0;
        break;
      }
      case "7": {
        ret = 1;
        break;
      }
      case "2": {
        ret = 2;
        break;
      }
      case "5535": {
        ret = 3;
        break;
      }
      case "5": {
        ret = 4;
        break;
      }
      case "8": {
        ret = 5;
        break;
      }
    }
    return ret;
  }

  clicked() {

    // need both to work
    this.dealerForm.patchValue({
      DMSId: "7"
    });
    this.selectedDMSText = this.DMSValues[1].viewValue;

    // const toSelect = this.DMSValues.find(c => c.value == '7');
    // // this.DMSId.get('DMSId').setValue(toSelect);
    // this.dealerForm.controls['DMSId'].setValue(toSelect);

  }
}
