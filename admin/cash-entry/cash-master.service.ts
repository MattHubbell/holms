import { Injectable } from '@angular/core';
import { FirebaseService } from '../../firebase';
import { CashMaster } from './cash-master.model';
import { Observable } from 'rxjs';

@Injectable()
export class CashMasterService {

    list: Observable<CashMaster[]>;
    
    constructor(private fs: FirebaseService) {}

    getList() {
        this.list = this.fs.getItems(CashMaster.TableName());
    }

    getItemByKey(key): any {
        return this.fs.getItemByKey(CashMaster.TableName(), key);
    }

    addItem(model: CashMaster) { 
        let data = CashMaster.setData(model);
        this.fs.addItem(CashMaster.TableName(), data);
    }
    
    updateItem(item:any, model: CashMaster) {
        let data = CashMaster.setData(model);
        this.fs.updateItem(CashMaster.TableName(), item.key, data);
    }

    deleteItem(item:any) {
        this.fs.deleteItem(CashMaster.TableName(), item.key);
    }

    deleteAllItems() {
        this.fs.deleteAllItems(CashMaster.TableName());
    }
}