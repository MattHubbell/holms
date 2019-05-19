import { Injectable } from '@angular/core';
import { FirebaseService } from '../../firebase';
import { CashDetailHistory } from './cash-detail-history.model';
import { Observable } from 'rxjs';
import * as f from '../../shared/functions';

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

    getListByDuesYear(duesYear: string) {
        this.list = this.fs.getItems(CashDetailHistory.TableName(), 'duesYear', duesYear);
    }

    getListByDateRange(startDate:Date, endDate:Date) {
        this.list = this.fs.getItemsByRange(CashDetailHistory.TableName(), 'transDate', f.toDatabaseDate(startDate), f.toDatabaseDate(endDate));
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