
import {throwError as observableThrowError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Headers, Http, Response, RequestOptions } from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {catchError} from 'rxjs/internal/operators';

import { environment } from '../../environments/environment';

@Injectable()
export class SignupService {
  private getEmailExistsUrl: string = environment.API_FLEX_ENDPOINT + 'emailtaken';
  private getCountyUrl:string  = environment.API_FLEX_ENDPOINT + 'county';
  
  constructor(private http: HttpClient) { }

  checkEmailNotTaken(email: string): Observable<boolean> {
    let url = `${this.getEmailExistsUrl}/${email}`;
    return this.http.get<boolean>(url).pipe(
      //.do(data => console.log('Email exists: ' + JSON.stringify(data)))
      catchError(this.handleError)
    );
  }

  getCounty(zip: string): Observable<string[]> {
    let url = `${this.getCountyUrl}/${zip}`;
    return this.http.get<string[]>(url).pipe(
        //.do(data => console.log('All: ' +  JSON.stringify(data)))
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