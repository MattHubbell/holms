import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { environment } from "../../environments/environment";
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PaypalService implements OnDestroy {

    authBasic: string;
    accessToken: string;
    subscription: Array<Subscription>;
    
    constructor(private httpClient: HttpClient) {
        if (environment.paypalMode == 'production') {
            this.authBasic = environment.paypalOauth2.production;
        } else {
            this.authBasic = environment.paypalOauth2.sandbox;
        }
        this.subscription = new Array<Subscription>();
        this.subscription.push(this.getPaypalAccessToken()
            .subscribe(data => {
                this.accessToken = data.access_token;
                console.log(this.accessToken);
            })
        );
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe());
    }

    getPaypalAccessToken() {
        const url = `${environment.paypalUrl}/oauth2/token`;
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/x-www-form-urlencoded',
              'Authorization': 'Basic ' + this.authBasic
            })
        };
        const body = new HttpParams()
            .set('grant_type', 'client_credentials');
        return this.httpClient.post<any>(url, body, httpOptions)
            .pipe(
                catchError(this.handleError)
            );
    }

    getPaypalPaymentByID(id: string) {
        const url = `${environment.paypalUrl}/payments/payment/` + id;
        const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type':  'application/json',
              'Authorization': 'Bearer ' + this.accessToken
            })
        };
        return this.httpClient.get<any>(url, httpOptions)
            .pipe(
                catchError(this.handleError)
            );
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('An error occurred:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        return throwError(
          'Something bad happened; please try again later.');
      };
}
