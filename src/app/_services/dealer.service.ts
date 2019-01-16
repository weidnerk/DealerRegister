
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable }    from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import {catchError} from 'rxjs/internal/operators';

// import { EmptyObservable } from 'rxjs/observable/EmptyObservable';

import { CMSCompany } from '../_models/company';
import { environment } from '../../environments/environment';

@Injectable()
export class DealerService {

    private postDealerUrl:string  = environment.API_ENDPOINT + 'company';
    private putDealerUrl:string  = environment.API_ENDPOINT + 'company';
    
    private getAccountUrl:string  = environment.API_FLEX_ENDPOINT + 'makeflexaccount';
    private getCompanyFromContactUrl:string  = environment.API_FLEX_ENDPOINT + 'company/companyfromcontact';
    private postFlexDealerMatchUrl:string  = environment.API_FLEX_ENDPOINT + 'company/flexdealermatch';
    private postCompanyUrl:string  = environment.API_FLEX_ENDPOINT + 'company/storecompany';
    
    constructor(private http: HttpClient) { }

    postDealer(company: CMSCompany): Observable<CMSCompany> {
        
        let url: string = this.postDealerUrl;
        let body = JSON.stringify(company);
        //let body = "{\"CompanyName\":\"xyz motor\"}";
        let options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
            
        return this.http.post<CMSCompany>(url, body, options).pipe(
            //.do(data => console.log('show company: ' +  JSON.stringify(data)))
            catchError(this.handleError)
        );
    }

    putDealer(dealer: CMSCompany): Observable<CMSCompany> {
        
        let url = `${this.putDealerUrl}/${dealer.CompanyID}`;
        let body = JSON.stringify(dealer);
        let options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

        return this.http.put<CMSCompany>(url, body, options).pipe(
            //.do(data => console.log('All: ' +  JSON.stringify(data)))
            catchError(this.handleError)
        );
    }
        
    // Create dealer credentials
    getAccount(cmsid: number): Observable<string> {
        let url = `${this.getAccountUrl}/${cmsid}`;
        return this.http.get<string>(url).pipe(
            //.do(data => console.log('All: ' +  JSON.stringify(data)))
            catchError(this.handleError)
        );
    }

    // We were supplied a contactid, so fill form with existing dealer
    getCompanyFromContact(contactid: number): Observable<CMSCompany> {
        let url = `${this.getCompanyFromContactUrl}/${contactid}`;
        return this.http.get<CMSCompany>(url).pipe(
            //.do(data => console.log('All: ' +  JSON.stringify(data)))
            catchError(this.handleError)
        );
    }

    postFlexDealerMatch(company: CMSCompany): Observable<CMSCompany> {
        
        let url: string = this.postFlexDealerMatchUrl;
        let body = JSON.stringify(company);
        let options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
            
        return this.http.post<CMSCompany>(url, body, options).pipe(
            //.do(data => console.log('dealer match: ' +  JSON.stringify(data)))
            catchError(this.handleError)
        );
    }
    
    postCompany(company: CMSCompany): Observable<CMSCompany> {
        
        let url: string = this.postCompanyUrl;
        let body = JSON.stringify(company);
        let options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
            
        return this.http.post<CMSCompany>(url, body, options).pipe(
            //.do(data => console.log('show company: ' +  JSON.stringify(data)))
            catchError(this.handleError)
        );
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        let body = error.json();
        console.log('dealer service API error: ' + body.Message);
        
        // throw an application level error
        return observableThrowError(body.Message || "dealer.service: Server error - cannot connect to API");
    }
        
}
