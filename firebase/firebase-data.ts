import {Observable} from "rxjs/Observable";
import {FirebaseItem} from "./firebase-item";

export interface FirebaseData extends Observable<FirebaseItem[]> {
    search(term: string): void;
    cancel(): void;
    matches(): any[];
};
