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
  styleUrls: ['./dealerreactive.component.css']
})
export class DealerReactiveComponent implements OnInit {

  ReferredByValues = [
    { value: '1', viewValue: 'Field Agent' },
    { value: '2', viewValue: 'Inside Marketing Agent' },
    { value: '3', viewValue: 'Referral from Current Client' },
    { value: '4', viewValue: 'Referral from Frazer' },
    { value: '5', viewValue: 'Other' }
  ];

  DMSValues = [
    { value: '6', viewValue: 'Frazer' },
    { value: '7', viewValue: 'Wayne Reaves' },
    { value: '2', viewValue: 'Auto Star Solutions' },
    { value: '5535', viewValue: 'Dealer Center' },
    { value: '5', viewValue: 'Finance Express' },
    { value: '8', viewValue: 'Other' }
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

  dealerForm: FormGroup;
  constructor(private fb: FormBuilder,
    private dealerService: DealerService,
    private router: Router,
    private dealerParams: DealerParamService,
    private signupService: SignupService,
    private activatedRoute: ActivatedRoute
  ) { }

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
          name: this.dealer.CompanyName,
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
          stateSalesTax: (this.dealer.DlrSaleTaxPer) ? Number(this.dealer.DlrSaleTaxPer) :null,
          countyTax: (this.dealer.DlrCntyTaxPer) ? Number(this.dealer.DlrCntyTaxPer) :null,
        });
        //this.dealerForm.controls['DMSId'].setValue('3');
        //this.dealerForm.controls['county'].setValue(this.dealer.County);
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
      name: [null, [Validators.required, Validators.minLength(2), Validators.pattern(DEALER_REGEX)]],
      firstName: [null, [Validators.required, Validators.minLength(2), Validators.pattern(FIRSTNAME_REGEX)]],
      lastName: [null, [Validators.required, Validators.minLength(2), Validators.pattern(LASTNAME_REGEX)]],
      email: [null, [Validators.required, Validators.email], this.validateEmailNotTaken.bind(this)],
      address: [null, Validators.required],
      address2: [null],
      city: [null, Validators.required],
      state: [null, Validators.required],
      zip: [null, this.validateZip.bind(this), this.validateCounty.bind(this)],
      phone: [null, this.validatePhone.bind(this)],
      submitFromDT: [false],
      DMSId: [null],
      DMSOther: [null],
      referredById: [null],
      county: [null, Validators.required],
      stateSalesTax: [null, [Validators.max(10), Validators.min(0)]],
      countyTax: [null, [Validators.max(10), Validators.min(0)]]
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

  get name() { return this.dealerForm.get('name'); }
  get firstName() { return this.dealerForm.get('firstName'); }
  get lastName() { return this.dealerForm.get('lastName'); }
  get address() { return this.dealerForm.get('address'); }
  get address2() { return this.dealerForm.get('address2'); }
  get city() { return this.dealerForm.get('city'); }
  get state() { return this.dealerForm.get('state'); }
  get email() { return this.dealerForm.get('email'); }
  get phone() { return this.dealerForm.get('phone'); }
  get zip() { return this.dealerForm.get('zip'); }
  get submitFromDT() { return this.dealerForm.get('submitFromDT'); }
  get DMSId() { return this.dealerForm.get('DMSId'); }
  get DMSOther() { return this.dealerForm.get('DMSOther'); }

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

  // Note: parameter here is NOT a Company object - it's a FormGroup
  onSubmit(dlrForm) {

    // --------------------------------------------------
    // Fill 'dealer' from form
    // --------------------------------------------------
    this.dealer.CreatedDate = new Date();
    this.dealer.CompanyName = dlrForm.name.trim();
    this.dealer.AddrLn1 = dlrForm.address.trim();
    this.dealer.AddrLn2 = (dlrForm.address2) ? dlrForm.address2.trim() : null;
    this.dealer.City = dlrForm.city.trim();
    this.dealer.State = dlrForm.state;
    this.dealer.Zip = dlrForm.zip;
    this.dealer.County = dlrForm.county;
    this.dealer.Phone = dlrForm.phone;
    this.dealer.SubmitFromDT = dlrForm.submitFromDT;

    // Did user select a DMS?
    if (dlrForm.DMSId != null) {
      if (this.dealer.CompanyProfile == null) {
        let p = new CompanyProfile();
        p.CompanyID = this.dealer.CompanyID;
        p.DMSId = Number(dlrForm.DMSId);
        this.dealer.CompanyProfile = p;
      }
      else {
        this.dealer.CompanyProfile.DMSId = Number(dlrForm.DMSId);
      }
      this.dealer.DMSName = this.getDMSNameFromID(this.dealer.CompanyProfile.DMSId);
    }
    this.dealer.DMSOther = dlrForm.DMSOther;

    // Did user select a "Referred By" value?
    if (dlrForm.referredById != null) {
      if (this.dealer.CompanyProfile == null) {
        let p = new CompanyProfile();
        p.CompanyID = this.dealer.CompanyID;
        p.ReferredBy = Number(dlrForm.referredById);
        this.dealer.CompanyProfile = p;
      }
      else {
        this.dealer.CompanyProfile.ReferredBy = Number(dlrForm.referredById);
      }
    }

    if (dlrForm.stateSalesTax)
      this.dealer.DlrSaleTaxPer = Number(dlrForm.stateSalesTax);
    else
      this.dealer.DlrSaleTaxPer = null;

    if (dlrForm.countyTax)
      this.dealer.DlrCntyTaxPer = Number(dlrForm.countyTax);
    else
      this.dealer.DlrCntyTaxPer = null;

    // fill contact
    if (this.dealer.CompanyID != null) {
      this.dealer.Contacts = [{
        ContactID: this.dealer.Contacts[0].ContactID,
        CompanyID: this.dealer.Contacts[0].CompanyID,
        Email: dlrForm.email,
        ContactName: dlrForm.firstName.trim() + ' ' + dlrForm.lastName.trim()
      }];
    }
    else {
      this.contact = new Contact();
      this.contact.ContactName = dlrForm.firstName.trim() + ' ' + dlrForm.lastName.trim();
      this.contact.Email = dlrForm.email;
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
}
