
import {throwError,  Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {catchError} from 'rxjs/internal/operators';

import { environment } from '../../environments/environment';

@Injectable()
export class SignupService {
  private getEmailExistsUrl: string = environment.API_FLEX_ENDPOINT + 'emailtaken';
  private getCountyUrl: string = environment.API_FLEX_ENDPOINT + 'county';

  constructor(private http: HttpClient) { }

  checkEmailNotTaken(email: string): Observable<boolean> {
    const url = `${this.getEmailExistsUrl}/${email}`;
    return this.http.get<boolean>(url).pipe(
      // .do(data => console.log('Email exists: ' + JSON.stringify(data)))
      catchError(this.handleError)
    );
  }

  getCounty(zip: string): Observable<string[]> {
    const url = `${this.getCountyUrl}/${zip}`;
    return this.http.get<string[]>(url).pipe(
        // .do(data => console.log('All: ' +  JSON.stringify(data)))
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
