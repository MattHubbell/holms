import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class EmailService {
    private emailUrl = environment.sendGridEmailUrl;

    constructor (private http: Http) {}

    sendMail(to, from, subject, body): Observable<any> {

        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        let data = JSON.stringify({
            to: to,
            from: from,
            subject: subject,
            body: body
            });

        return this.http.post(this.emailUrl, data, options)
                        .map( res => this.extractData(res))
                        .catch(res => this.handleError(res));
    }

    private extractData(res: Response | any) {
        let msg: string;
        if (res.isJson) {
            let body = res.json();
            msg = body.msg || { };
        } else {
            msg = "Email successfully sent.";
        }
        return msg;
    }

    private handleError (error: Response | any) {
        // In a real world app, we might use a remote logging infrastructure
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.error || JSON.stringify(body);
            errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.log(errMsg);
        return Observable.throw(errMsg);
    }

    isJson(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    toInvoiceBody(nameLit: string, foundationLit: string, museum_libraryLit: string, scholarshipLit: string, paidThruDate: string, comments: string, duesQuantity: number, duesAmount: number, foundation: number, museum_library: number, scholarship: number): string {
        const membershipTotal = (duesQuantity * duesAmount) + foundation + museum_library + scholarship;
        const body: string = `<html><head></head><body><p>
        <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        td, th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        </style> 
        ` + nameLit + `, <br><br>
        Thank you for your payment! <br><br>
        Your PayPal Transaction ID is ` + comments + `<br>
        <table>
            <tr>
                <td>DUES PAID                </td><td style="text-align: right;">$` + (duesAmount * duesQuantity)        + `</td>
            </tr>
            <tr> 
                <td>` + foundationLit     + `</td><td style="text-align: right;">$` + foundation                         + `</td>
            </tr>
            <tr> 
                <td>` + museum_libraryLit + `</td><td style="text-align: right;">$` + museum_library                     + `</td>
            </tr>
            <tr> 
                <td>` + scholarshipLit    + `</td><td style="text-align: right;">$` + scholarship                        + `</td>
            </tr>
            <tr>
                <td>                        </td><td style="text-align: right;">                              _____________ </td>
            </tr>
            <tr> 
                <td>Total Paid ->            </td><td style="text-align: right;">$` + membershipTotal                    + `</td>
            </tr>
            <tr>
                <td>                        </td><td style="text-align: right;">                                            </td>
            </tr>
            <tr> 
                <td>Paid Through ->          </td><td style="text-align: right;"> ` + paidThruDate                      +  `</td>
            </tr>
        </table>        
        </p></body></html>`;
        return body;
    }
    toGiftInvoiceBody(nameLit: string, paidThruDate: Date, comments: string, duesQuantity: number, duesAmount: number, merchandisePackageAmt: number, shippingCharges: number): string {
        const membershipTotal = (duesQuantity * duesAmount) + merchandisePackageAmt + shippingCharges;
        const body: string = `<html><head></head><body><p>
        <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        td, th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        </style> 
        ` + nameLit + `, <br><br>
        Thank you for your payment! <br><br>
        Your PayPal Transaction ID is ` + comments + `<br>
        <table>
            <tr>
                <td>GIFT DUES PAID           </td><td style="text-align: right;">$` + (duesAmount * duesQuantity)        + `</td>
            </tr>
            <tr>
                <td>Merchandise Package      </td><td style="text-align: right;">$` + (merchandisePackageAmt)             + `</td>
            </tr>
            <tr>
                <td>Shipping Charges        </td><td style="text-align: right;">$` + (shippingCharges)                    + `</td>
            </tr>
            <tr>
                <td>                        </td><td style="text-align: right;">                              _____________ </td>
            </tr>
            <tr> 
                <td>Total Paid ->            </td><td style="text-align: right;">$` + membershipTotal                    + `</td>
            </tr>
            <tr>
                <td>                        </td><td style="text-align: right;">                                            </td>
            </tr>
            <tr> 
                <td>Paid Through ->          </td><td style="text-align: right;"> ` + paidThruDate.toLocaleDateString() +  `</td>
            </tr>
        </table>        
        </p></body></html>`;
        return body;
    }

    toRegisterBody(email: string, registrationName: string, street1: string, street2: string, city: string, state: string, zip: string, country: string) {
        const body: string = `<html><head></head><body><p>
        <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        td, th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        </style> 
        Membership Chair, <br><br>
        A new member has registered: <br>
        <table>
            <tr>
                <td>E-Mail            </td><td>` + email + `</td>
            </tr>
            <tr>
                <td>Registration Name </td><td>` + registrationName + `</td>
            </tr>
            <tr>
                <td>Street 1          </td><td>` + street1 + `</td>
            </tr>
            <tr> 
                <td>Street 2          </td><td>` + street2 + `</td>
            </tr>
            <tr> 
                <td>City, State, Zip  </td><td>` + city + `, ` + state + `  ` + zip + `</td>
            </tr>
            <tr> 
                <td>Country          </td><td>` + country + `</td>
            </tr>
        </table>        
        </p></body></html>`;
        return body;
    }

    toAcknowledgementBody(registrationName: string, regEmailMessage: string) {
        const body: string = `<html><head></head><body><p>
        <style>
        table {
            border-collapse: collapse;
            width: 100%;
        }
        td, th {
            border: 1px solid #dddddd;
            text-align: left;
            padding: 8px;
        }
        </style> 
        ` + registrationName + `, <br><br>
        ` + regEmailMessage + ` <br><br>
        </p></body></html>`;
        return body;
    }
}
