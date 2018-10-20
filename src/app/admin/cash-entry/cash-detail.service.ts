import { Injectable } from '@angular/core';
import { FirebaseService } from '../../firebase';
import { CashDetail } from './cash-detail.model';
import { Observable } from 'rxjs';

@Injectable()
export class CashDetailService {

    list: Observable<CashDetail[]>;
    
    constructor(private fs: FirebaseService) {}

    getList() {
        this.list = this.fs.getItems(CashDetail.TableName());
    }

    getItemByID(equalTo:string): any {
        return this.fs.getItems(CashDetail.TableName(), 'MemberNo', equalTo);
    }

    getItemByKey(key:any) {
        return this.fs.getItemByKey(CashDetail.TableName(), key);
    }

    addItem(model: CashDetail) { 
        let data = CashDetail.setData(model);
        this.fs.addItem(CashDetail.TableName(), data);
    }
    
    updateItem(item:any, model: CashDetail) {
        let data = CashDetail.setData(model);
        this.fs.updateItem(CashDetail.TableName(), item.key, data);
    }

    deleteItem(item:any) {
        this.fs.deleteItem(CashDetail.TableName(), item.key);
    }

    deleteAllItems() {
        this.fs.deleteAllItems(CashDetail.TableName());
    }
}