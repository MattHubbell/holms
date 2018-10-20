import { Injectable } from '@angular/core';
import { FirebaseService } from '../../firebase';
import { NewRegistration } from './new-registration.model';
import { Observable } from 'rxjs';

@Injectable()
export class NewMemberService {

    list: Observable<NewRegistration[]>;
    
    constructor(private fs: FirebaseService) {}

    getList() {
        this.list = this.fs.getItems(NewRegistration.TableName());
    }

    getItemByKey(key:any): any {
        return this.fs.getItemByKey(NewRegistration.TableName(), key);
    }

    addItem(key:string, model: NewRegistration) { 
        let data = NewRegistration.setData(model);
        this.fs.addObject(NewRegistration.TableName() + '/' + key, data);
    }
    
    updateItem(item:any, model: NewRegistration) {
        let data = NewRegistration.setData(model);
        this.fs.updateItem(NewRegistration.TableName(), item.key, data);
    }

    deleteItem(item:any) {
        this.fs.deleteItem(NewRegistration.TableName(), item.key);
    }

    deleteAllItems() {
        this.fs.deleteAllItems(NewRegistration.TableName());
    }
}