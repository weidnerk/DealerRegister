import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { CMSCompany } from '../_models/company';
import { DealerParamService } from '../_services/dealerparam.service'

@Component({
    selector: 'dealer-review',
    templateUrl: './dealerreview.component.html',
    styleUrls: ['./dealerreview.component.css']
  })
  export class DealerReviewComponent { 

    paramDealer: CMSCompany;
    firstName: string;
    lastName: string;
    referredByName: string;
  
    constructor(private route: Router, private dealerParams: DealerParamService) { 
    }

    ngOnInit() {
      
      // subscribe to the currentDealer observable
      this.dealerParams.currentDealer.subscribe(
        paramDealer => {
          this.paramDealer = paramDealer;
          this.firstName = this.getFirstName(this.paramDealer.Contacts[0].ContactName);
          this.lastName = this.getLastName(this.paramDealer.Contacts[0].ContactName);
          if (this.paramDealer.CompanyProfile)
            this.referredByName = this.getReferredFromID(this.paramDealer.CompanyProfile.ReferredBy);
        }
      );
    }

    return(){
        this.route.navigate(['/dealerreactive']);
    }
    welcome(){
      this.route.navigate(['/welcome']);
  }

  getFirstName(contact: string): string {
    var stringArray = contact.split(/(\s+)/);
    return stringArray[0];
  }
  getLastName(contact: string): string {
    var stringArray = contact.split(/(\s+)/);
    return stringArray[2];
  }

  getReferredFromID(id: number) {
    let name: string;
    switch (id) {
      case 1:
        name = 'Field Agent';
        break;
      case 2:
        name = 'Inside Marketing Agent';
        break;
      case 3:
        name = 'Referral from Current Client';
        break;
      case 4:
        name = 'Referral from Frazer';
        break;
      case 5:
        name = 'Other';
        break;
      default:
        name = null;
    }
    return name;
  }

}