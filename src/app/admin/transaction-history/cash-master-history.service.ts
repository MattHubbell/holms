import { Injectable } from '@angular/core';
import { FirebaseService } from '../../firebase';
import { CashMasterHistory } from './cash-master-history.model';
import { Observable } from 'rxjs';
import * as f from '../../shared/functions';

@Injectable()
export class CashMasterHistoryService {

    list: Observable<CashMasterHistory[]>;
    
    constructor(private fs: FirebaseService) {}

    getList() {
        this.list = this.fs.getItems(CashMasterHistory.TableName());
    }

    getListByMemberNo(memberNo: string) {
        this.list = this.fs.getItems(CashMasterHistory.TableName(), 'memberNo', memberNo);
    }

    getListByDateRange(startDate:Date, endDate:Date) {
        this.list = this.fs.getItemsByRange(CashMasterHistory.TableName(), 'transDate', f.toDatabaseDate(startDate), f.toDatabaseDate(endDate));
    }

    getItemsByReceiptNoAsync(receiptNo: string) {
        return this.fs.getItemsAsync1(CashMasterHistory.TableName(),'receiptNo', receiptNo);
    }

    addItem(model: CashMasterHistory) { 
        let data = CashMasterHistory.setData(model);
        this.fs.addItem(CashMasterHistory.TableName(), data);
    }
    
    updateItem(item:any, model: CashMasterHistory) {
        let data = CashMasterHistory.setData(model);
        this.fs.updateItem(CashMasterHistory.TableName(), item.key, data);
    }

    deleteItem(item:any) {
        this.fs.deleteItem(CashMasterHistory.TableName(), item.key);
    }

    deleteAllItems() {
        this.fs.deleteAllItems(CashMasterHistory.TableName());
    }
}