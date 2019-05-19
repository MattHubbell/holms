import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import 'rxjs/add/operator/take';
import * as firebase from 'firebase/app';
import { FirebaseUser } from './firebase-user.model';
import { environment } from '../../environments/environment';

@Injectable()
export class FirebaseService {

    constructor(public afAuth: AngularFireAuth, public db: AngularFireDatabase) {}

    get auth(): any {
        return this.afAuth;
    }

    get authenticated(): boolean {
        return this.afAuth.auth.currentUser !== null;
    }

    get currentUser(): boolean {
        return this.afAuth.auth.currentUser !== null;
    }

    get user(): FirebaseUser {
        let user:FirebaseUser = new FirebaseUser();
        if (this.authenticated) {
            user.id = this.afAuth.auth.currentUser.uid;
            user.name = this.afAuth.auth.currentUser.displayName;
            user.email = this.afAuth.auth.currentUser.email;
            user.picture = this.afAuth.auth.currentUser.photoURL;
            user.verified = this.afAuth.auth.currentUser.emailVerified;
        }
        return user;
    }

    signInWithGoogle(): Promise<any> {
        return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    }

    signInWithFacebook(): Promise<any> {
        return this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
    }

    signInWithEmail(email:string, password:string): Promise<any> {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password);
    }

    async resetPassword(email:string): Promise<any> {
        try {
            await this.afAuth.auth.sendPasswordResetEmail(email);
            console.log('Password successfully updated');
        }
        catch (error) {
            console.log(error);
        }
    }

    async changeEmail(email: string): Promise<any> {
        try {
            await this.afAuth.auth.currentUser.updateEmail(email);
            console.log('Email successfully updated');
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }

    async updateProfile(displayName: string): Promise<any> {
        try {
            await this.afAuth.auth.currentUser.updateProfile({displayName: displayName, photoURL: ''});
            console.log('Profile successfully updated');
        }
        catch (error) {
            console.log(error);
            return Promise.reject(error);
        }
    }

    createUser(email:string, password:string): Promise<any> {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
    }

    // createFacebookUser(): any {
    //     firebase.auth().getRedirectResult().then(result => {
    //         if(result.credential) {
    //             let token = result.credential.;
    //         }
    //         let user = result.user;
    //     });
    //     let provider = new firebase.auth.FacebookAuthProvider();
    //     return this.afAuth.auth.signInWithRedirect(provider);
    // }

    logout() {
      this.afAuth.auth.signOut();
    }

    private getItemsRef(tableName:string, child:string = '', equalTo:string = ''): AngularFireList<any>{
        if (child.length > 0 && equalTo.length > 0) {
            return this.db.list(tableName, ref => ref.orderByChild(child).equalTo(equalTo));
        }
        if (child.length > 0) {
            return this.db.list(tableName, ref => ref.orderByChild(child));
        }
        return this.db.list(tableName);
    }

    public getItems(tableName:string, child:string = '', equalTo:string = ''): Observable<any[]> {
        return this.getItemsRef(tableName, child, equalTo).snapshotChanges().pipe(
            map(changes => (
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
            ))
        )        
    }

    public getItemsAsync(tableName:string, child:string = '', equalTo:string = '') {
        return this.getItemsRef(tableName, child, equalTo).snapshotChanges().pipe(
            map(changes => (
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
            ))
        ).take(1).toPromise();
    }

    public getItemsAsync1(tableName:string, child:string = '', equalTo:string = '') {
        return this.getItemsRef(tableName, child, equalTo).snapshotChanges().pipe(
            map(changes => (
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
            ))
        ).take(1);
    }

    private getItemsRefRange(tableName:string, child:string, startAt:string, endAt:string): AngularFireList<any>{
        if (child.length > 0 && startAt.length > 0 && endAt.length > 0) {
            return this.db.list(tableName, ref => ref.orderByChild(child).startAt(startAt).endAt(endAt));
        }
        return this.db.list(tableName);
    }

    public getItemsByRange(tableName:string, child:string, startAt:string, endAt:string): Observable<any[]> {
        return this.getItemsRefRange(tableName, child, startAt, endAt).snapshotChanges().pipe(
            map(changes => (
                changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
            ))
        )        
    }

    public findDuplicateId(tableName:string, equalTo:string, id:any) {
        return this.db.list(tableName).snapshotChanges()
            .map(records => {
                let exists = false;
                records.forEach(x => {
                    if (x[equalTo].toLowerCase() === id.toLowerCase()) {
                        console.log(equalTo + ' already exists!');
                    exists = true;
                }
            });
        return exists;
        }).toPromise();
    }

    public addItem(tableName:string, data:any) {
        this.consoleLog(tableName + ' data: ' + JSON.stringify(data));
        this.db.list(tableName).push(data)
            .then(_ => console.log(tableName + ' added'));
}

    public updateItem(tableName:string, key:string, data:any) {
        this.consoleLog(tableName + ' data: ' + JSON.stringify(data));
        this.getItemsRef(tableName).update(key, data)
            .then(_ => console.log(tableName + ' updated'))
            .catch(err => console.log(tableName + ' error: ' + err));
    }

    public deleteItem(tableName:string, key:string) {
        if (key == undefined) {
            console.log('key undefined');
            return;
        }
        this.getItemsRef(tableName).remove(key)
            .then(_ => console.log(tableName + ' deleted'))
            .catch(err => console.log(tableName + ' error: ' + err));
    }

    public deleteAllItems(tableName:string) {
        this.getItemsRef(tableName).remove()
            .then(_ => console.log(tableName + ' deleted'))
            .catch(err => console.log(tableName + ' error: ' + err));
    }

    public getItem(tableName:string): any {
        return this.db.object(tableName).valueChanges();
    }

    public getItemByKey(tableName:string, key: any) {
        let itemRef = this.db.object(tableName + '/' + key);
        return itemRef.valueChanges(); 
    }

    public addObject(objectName:string, data:any) {
        this.consoleLog(objectName + ' data: ' + JSON.stringify(data));
        let itemRef = this.db.object(objectName);
        itemRef.set(data)
        .then(_ => console.log(objectName + ' added'))
        .catch(err => console.log(objectName + ' error: ' + err));
}

    public updateObject(objectName:string, data:any) {
        this.consoleLog(objectName + ' data: ' + JSON.stringify(data));
        let itemRef = this.db.object(objectName);
        itemRef.update(data)
            .then(_ => console.log(objectName + ' updated'))
            .catch(err => console.log(objectName + ' error: ' + err));
    }

    public deleteObject(objectName:string) {
        let itemRef = this.db.object(objectName);
        itemRef.remove()
            .then(_ => console.log(objectName + ' deleted'))
            .catch(err => console.log(objectName + ' error: ' + err));
    }

    public consoleLog(text: any) {
        if (environment.production) { 
            return;
        }
        console.log(text);
    }
}
