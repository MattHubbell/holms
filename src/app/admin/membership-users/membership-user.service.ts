import { Injectable } from '@angular/core';
import { FirebaseService } from '../../firebase';
import { MembershipUser } from './membership-user.model';
import { Observable } from 'rxjs';

@Injectable()
export class MembershipUserService {

    list: Observable<MembershipUser[]>;
    
    constructor(private fs: FirebaseService) {}

    getList() {
        this.list = this.fs.getItems(MembershipUser.TableName());
    }

    getItemByID(equalTo:string): any {
        return this.fs.getItems(MembershipUser.TableName(), 'memberId', equalTo);
    }

    getItemByKey(key:any): any {
        return this.fs.getItemByKey(MembershipUser.TableName(), key);
    }

    addItem(key:string, model: MembershipUser) { 
        let data = MembershipUser.setData(model);
        this.fs.addObject(MembershipUser.TableName() + '/' + key, data);
    }
    
    updateItem(item:any, model: MembershipUser) {
        let data = MembershipUser.setData(model);
        this.fs.updateItem(MembershipUser.TableName(), item.key, data);
    }

    updateObject(item:any, key:string, model: MembershipUser) {
        let data = MembershipUser.setData(model);
        this.fs.updateObject(MembershipUser.TableName() + '/' + key, data);
    }

    deleteItem(item:any) {
        this.fs.deleteItem(MembershipUser.TableName(), item.key);
    }

    deleteAllItems() {
        this.fs.deleteAllItems(MembershipUser.TableName());
    }
}