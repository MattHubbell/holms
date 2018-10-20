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
}
