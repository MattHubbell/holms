import { Injectable, Inject } from "@angular/core";
import { Observable } from 'rxjs';
import { LocalData } from "./local-data";

@Injectable()
export class FirebaseSearchService {
    constructor(
        @Inject(LocalData) private localDataFactory: any, // Using any instead of () => LocalData because on AoT errors
    ) { }

    localData: LocalData;

    public local(data: any[] | Observable<any>, searchFields: string, titleField: string): LocalData {

        this.localData = this.localDataFactory();
        return this.localData
            .data(data)
            .searchFieldss(searchFields)
            .titleField(titleField);
    }

    public closeLocal() {
        if (this.localData != undefined) {
            this.localData.closeSubscription();
        }
    }
}
