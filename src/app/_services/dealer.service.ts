
import {throwError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import {catchError} from 'rxjs/internal/operators';

// import { EmptyObservable } from 'rxjs/observable/EmptyObservable';

import { CMSCompany } from '../_models/company';
import { environment } from '../../environments/environment';

@Injectable()
export class DealerService {

    private postDealerUrl: string  = environment.API_ENDPOINT + 'company';
    private putDealerUrl: string  = environment.API_ENDPOINT + 'company';

    private getAccountUrl: string  = environment.API_FLEX_ENDPOINT + 'makeflexaccount';
    private getCompanyFromContactUrl: string  = environment.API_FLEX_ENDPOINT + 'company/companyfromcontact';
    private postFlexDealerMatchUrl: string  = environment.API_FLEX_ENDPOINT + 'company/flexdealermatch';
    private postCompanyUrl: string  = environment.API_FLEX_ENDPOINT + 'company/storecompany';

    constructor(private http: HttpClient) { }

    postDealer(company: CMSCompany): Observable<CMSCompany> {

        const url: string = this.postDealerUrl;
        const body = JSON.stringify(company);
        // let body = "{\"CompanyName\":\"xyz motor\"}";
        const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

        return this.http.post<CMSCompany>(url, body, options).pipe(
            // .do(data => console.log('show company: ' +  JSON.stringify(data)))
            catchError(this.handleError)
        );
    }

    putDealer(dealer: CMSCompany): Observable<CMSCompany> {

        const url = `${this.putDealerUrl}/${dealer.CompanyID}`;
        const body = JSON.stringify(dealer);
        const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

        return this.http.put<CMSCompany>(url, body, options).pipe(
            // .do(data => console.log('All: ' +  JSON.stringify(data)))
            catchError(this.handleError)
        );
    }

    // Create dealer credentials
    getAccount(cmsid: number): Observable<string> {
        const url = `${this.getAccountUrl}/${cmsid}`;
        return this.http.get<string>(url).pipe(
            // .do(data => console.log('All: ' +  JSON.stringify(data)))
            catchError(this.handleError)
        );
    }

    // We were supplied a contactid, so fill form with existing dealer
    getCompanyFromContact(contactid: number): Observable<CMSCompany> {
        const url = `${this.getCompanyFromContactUrl}/${contactid}`;
        return this.http.get<CMSCompany>(url).pipe(
            // .do(data => console.log('All: ' +  JSON.stringify(data)))
            catchError(this.handleError)
        );
    }

    postFlexDealerMatch(company: CMSCompany): Observable<CMSCompany> {

        const url: string = this.postFlexDealerMatchUrl;
        const body = JSON.stringify(company);
        const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

        return this.http.post<CMSCompany>(url, body, options).pipe(
            // .do(data => console.log('dealer match: ' +  JSON.stringify(data)))
            catchError(this.handleError)
        );
    }

    postCompany(company: CMSCompany): Observable<CMSCompany> {

        const url: string = this.postCompanyUrl;
        const body = JSON.stringify(company);
        const options = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

        return this.http.post<CMSCompany>(url, body, options).pipe(
            // .do(data => console.log('show company: ' +  JSON.stringify(data)))
            catchError(this.handleError)
        );
    }

    private handleError(error: any) {
        if (error.error instanceof ProgressEvent) { // connection problem
            return throwError(error.message || 'Server error');
        } else {
            // server returned exception
            if (error.error.innerException) {
                return throwError(error.status + ' ' + error.error.innerException.exceptionMessage);
            }
            // Errors collection populated in CustomerAppLeaseResponse
            if (error.error.errors) {
                return throwError(error.status + ' ' + error.error.errors[0].message);
            }
            return throwError(error.status + ' an error occurred');
        }
    }

}
