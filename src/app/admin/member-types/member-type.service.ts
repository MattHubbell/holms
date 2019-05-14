import { Injectable } from '@angular/core';
import { FirebaseService } from '../../firebase';
import { MemberType } from './member-type.model';
import { Observable } from 'rxjs';

@Injectable()
export class MemberTypeService {

    list: Observable<MemberType[]>;
    
    constructor(private fs: FirebaseService) {}

    getList() {
        this.list = this.fs.getItems(MemberType.TableName());
    }

    getListByID() {
        this.list = this.fs.getItems(MemberType.TableName(), 'id');
    }

    getItemByID(equalTo:string): any {
        return this.fs.getItems(MemberType.TableName(), 'id', equalTo);
    }

    getItemByKey(key:any): any {
        return this.fs.getItemByKey(MemberType.TableName(), key);
    }

    addItem(model: MemberType) { 
        let data = MemberType.setData(model);
        this.fs.addItem(MemberType.TableName(), data);
    }
    
    updateItem(item:any, model: MemberType) {
        let data = MemberType.setData(model);
        this.fs.updateItem(MemberType.TableName(), item.key, data);
    }

    deleteItem(item:any) {
        this.fs.deleteItem(MemberType.TableName(), item.key);
    }

    deleteAllItems() {
        this.fs.deleteAllItems(MemberType.TableName());
    }
}