import { Injectable } from '@angular/core';
import { FirebaseService } from '../../firebase';
import { CashDetailHistory } from './cash-detail-history.model';
import { Observable } from 'rxjs';

@Injectable()
export class CashDetailHistoryService {

    list: Observable<CashDetailHistory[]>;
    
    constructor(private fs: FirebaseService) {}

    getList() {
        this.list = this.fs.getItems(CashDetailHistory.TableName());
    }

    getListByID(equalTo:string) {
        this.list = this.fs.getItems(CashDetailHistory.TableName(), 'receiptNo', equalTo);
    }

    getListByReceiptNo(receiptNo: string) {
        this.list = this.fs.getItems(CashDetailHistory.TableName(), 'receiptNo', receiptNo);
    }

    addItem(model: CashDetailHistory) { 
        let data = CashDetailHistory.setData(model);
        this.fs.addItem(CashDetailHistory.TableName(), data);
    }
    
    updateItem(item:any, model: CashDetailHistory) {
        let data = CashDetailHistory.setData(model);
        this.fs.updateItem(CashDetailHistory.TableName(), item.key, data);
    }

    deleteItem(item:any) {
        this.fs.deleteItem(CashDetailHistory.TableName(), item.key);
    }

    deleteAllItems() {
        this.fs.deleteAllItems(CashDetailHistory.TableName());
    }
}