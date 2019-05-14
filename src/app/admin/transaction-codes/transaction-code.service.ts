import { Injectable } from '@angular/core';
import { FirebaseService } from '../../firebase';
import { TransactionCode } from './transaction-code.model';
import { Observable } from 'rxjs';

@Injectable()
export class TransactionCodeService {

    list: Observable<TransactionCode[]>;
    itemsById: Observable<TransactionCode[]>;
    
    constructor(private fs: FirebaseService) {}S

    getList() {
        this.list = this.fs.getItems(TransactionCode.TableName());
    }

    getItemById(id:any) {
        this.itemsById = this.fs.getItems(TransactionCode.TableName(),'id', id);
    }

    async getItemByIdAsync(id:any) {
        const val = await this.fs.getItemsAsync(TransactionCode.TableName(),'id', id)
        return val.length;
    }

    findDuplicateId(id:any) {
        this.fs.findDuplicateId(TransactionCode.TableName(), 'id', id);
    }

    addItem(model: TransactionCode) { 
        let data = TransactionCode.setData(model);
        this.fs.addItem(TransactionCode.TableName(), data);
    }
    
    updateItem(item:any, model: TransactionCode) {
        let data = TransactionCode.setData(model);
        this.fs.updateItem(TransactionCode.TableName(), item.key, data);
    }

    deleteItem(item:any) {
        this.fs.deleteItem(TransactionCode.TableName(), item.key);
    }

    deleteAllItems() {
        this.fs.deleteAllItems(TransactionCode.TableName());
    }
}