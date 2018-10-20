import { Injectable } from '@angular/core';
import { FirebaseService } from '../../firebase';
import { MemberStatus } from './member-status.model';
import { Observable } from 'rxjs';

@Injectable()
export class MemberStatusService {

    list: Observable<MemberStatus[]>;
    
    constructor(private fs: FirebaseService) {}

    getList() {
        this.list = this.fs.getItems(MemberStatus.TableName());
    }

    getListByID() {
        this.list = this.fs.getItems(MemberStatus.TableName(), 'id');
    }

    getItemByID(equalTo:string): any {
        return this.fs.getItems(MemberStatus.TableName(), 'id', equalTo);
    }

    getItemByKey(key:string): any {
        return this.fs.getItemByKey(MemberStatus.TableName(), key);
    }

    addItem(model: MemberStatus) { 
        let data = MemberStatus.setData(model);
        this.fs.addItem(MemberStatus.TableName(), data);
    }
    
    updateItem(item:any, model: MemberStatus) {
        let data = MemberStatus.setData(model);
        this.fs.updateItem(MemberStatus.TableName(), item.key, data);
    }

    deleteItem(item:any) {
        this.fs.deleteItem(MemberStatus.TableName(), item.key);
    }

    deleteAllItems() {
        this.fs.deleteAllItems(MemberStatus.TableName());
    }
}