import { Component, OnInit } from '@angular/core';

import { CMSCompany } from '../_models/company';
import { DealerParamService } from '../_services/dealerparam.service'
import { DealerService } from '../_services/dealer.service'

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {

  paramDealer: CMSCompany | null;
  createAcctResult: string;
  errorMessage: string;
  
  constructor(private dealerParams: DealerParamService, private dealerService: DealerService) { }

  ngOnInit() {

    this.dealerParams.currentDealer.subscribe(
      paramDealer => {
        this.paramDealer = paramDealer;
        this.CreateAccount(this.paramDealer.CompanyID);
      }
    );
  }

  CreateAccount(cmsid: number) {
    this.dealerService.getAccount(this.paramDealer.CompanyID).subscribe(
      data => {
        this.createAcctResult = <string>data;
        this.errorMessage = (this.createAcctResult == null) ? "Account created successfully." : "Account creation failed: " + this.createAcctResult ;
      },
      error => {
        console.log('save error handler ' + error);
        this.errorMessage = <any>error
      }
      ,      // in case of failure show this message
      () =>this.dealerParams.changeDealer(null)
      
    );
  }
}
