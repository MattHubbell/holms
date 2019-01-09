import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase';
import { Member } from './member.model';
import { Observable } from 'rxjs';

@Injectable()
export class MemberService {

    list: Observable<Member[]>;
    
    constructor(private fs: FirebaseService) {}

    getList() {
        this.list = this.fs.getItems(Member.TableName(), 'memberNo');
    }

    getItemByMemberID(equalTo:string): any {
        return this.fs.getItems(Member.TableName(), 'memberNo', equalTo);
    }

    getItemByKey(key:any): any {
        return this.fs.getItemByKey(Member.TableName(), key);
    }

    addItem(model: Member) { 
        let data = Member.setData(model);
        this.fs.addItem(Member.TableName(), data);
    }
    
    updateItem(item:any, model: Member) {
        let data = Member.setData(model);
        this.fs.updateItem(Member.TableName(), item.key, data);
    }

    updateObject(key:string, model: Member) {
        let data = Member.setData(model);
        this.fs.updateObject(Member.TableName() + '/' + key, data);
    }

    deleteItem(item:any) {
        this.fs.deleteItem(Member.TableName(), item.key);
    }

    deleteAllItems() {
        this.fs.deleteAllItems(Member.TableName());
    }
}
