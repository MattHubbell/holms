import { Injectable } from '@angular/core';
import { FirebaseService } from '../../firebase';
import { AppMenu } from './app-menu.model';
import { Observable } from 'rxjs';

@Injectable()
export class AppMenuService {

    list: Observable<AppMenu[]>;
    
    constructor(private fs: FirebaseService) {}

    getList() {
        this.list = this.fs.getItems(AppMenu.TableName());
    }

    getListByID() {
        this.list = this.fs.getItems(AppMenu.TableName(), 'menuId');
    }

    getItemByID(id:any, equalTo:string): any {
        return this.fs.getItems(AppMenu.TableName(), id, equalTo);
    }

    addItem(model: AppMenu) { 
        let data = AppMenu.setMembers(model);
        this.fs.addItem(AppMenu.TableName(), data);
    }
    
    updateItem(item:any, model: AppMenu) {
        let data = AppMenu.setMembers(model);
        this.fs.updateItem(AppMenu.TableName(), item.key, data);
    }

    deleteItem(item:any) {
        this.fs.deleteItem(AppMenu.TableName(), item.key);
    }

    deleteAllItems() {
        this.fs.deleteAllItems(AppMenu.TableName());
    }
}