import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase';
import { GiftMembership } from './gift-membership.model';
import { Observable } from 'rxjs';

@Injectable()
export class GiftMembershipService {

    list: Observable<GiftMembership[]>;
    
    constructor(private fs: FirebaseService) {}

    getList() {
        this.list = this.fs.getItems(GiftMembership.TableName(), 'memberNo');
    }

    getItemByGiftMembershipID(equalTo:string): any {
        return this.fs.getItems(GiftMembership.TableName(), 'memberNo', equalTo);
    }

    getItemByKey(key:any): any {
        return this.fs.getItemByKey(GiftMembership.TableName(), key);
    }

    addItem(model: GiftMembership) { 
        let data = GiftMembership.setData(model);
        this.fs.addItem(GiftMembership.TableName(), data);
    }
    
    updateItem(item:any, model: GiftMembership) {
        let data = GiftMembership.setData(model);
        this.fs.updateItem(GiftMembership.TableName(), item.key, data);
    }

    updateObject(key:string, model: GiftMembership) {
        let data = GiftMembership.setData(model);
        this.fs.updateObject(GiftMembership.TableName() + '/' + key, data);
    }

    deleteItem(item:any) {
        this.fs.deleteItem(GiftMembership.TableName(), item.key);
    }

    deleteAllItems() {
        this.fs.deleteAllItems(GiftMembership.TableName());
    }
}
