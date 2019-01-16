// refer to: https://www.youtube.com/watch?v=I317BhehZKM

import { Injectable }    from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { CMSCompany } from '../_models/company';

@Injectable()
export class DealerParamService {

  // BehaviorSubject ensures that components consuming the service receive the most recent, up to date data

  // 1. Hold current value of the Company (notice private)
  private dealerSource = new BehaviorSubject(new CMSCompany());
  private qryStrSource = new BehaviorSubject<boolean>(false);
  
  // 2. Create observable to be used by the components - thus, the variable is public
  currentDealer = this.dealerSource.asObservable();
  currentQryStr = this.qryStrSource.asObservable();

  constructor(){ }  

  // call 'next' on the BehaviorSubject to changes its current value
  changeDealer(dealer: CMSCompany){
    this.dealerSource.next(dealer);
  }
  changeQryStrVal(qryStrVal: boolean){
    this.qryStrSource.next(qryStrVal);
  }
}