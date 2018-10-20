import { Injectable } from "@angular/core";
import { Observable } from 'rxjs';

import { FirebaseBaseData } from "./firebase-base-data";
import { Subscription } from "rxjs/Subscription";

@Injectable()
export class LocalData extends FirebaseBaseData {

    private _data: any[];
    private savedTerm: string;
    private _matches: any[];
    private _sub: Subscription;

    constructor() {
        super();
    }

    public data(data: any[] | Observable<any[]>) {
        if (data instanceof Observable) {
            this._sub = (<Observable<any[]>>data).subscribe((res) => {
                this._data = res;
                if (this.savedTerm) {
                    this.search(this.savedTerm);
                }
            });
        } else {
            this._data = <any[]>data;
        }

        return this;
    }

    public search(term: string): void {
        if (!this._data) {
            this.savedTerm = term;
        } else {
            this.savedTerm = null;
            this._matches = this.extractMatches(this._data, term);
            this.next(this.processResults(this._matches, term));
        }
    }

    public matches() {
        return this._matches;
    }

    public closeSubscription() {
        this._sub.unsubscribe();
    }
}
