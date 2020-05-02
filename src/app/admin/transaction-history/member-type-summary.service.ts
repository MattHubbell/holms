import { Injectable } from '@angular/core';
import { FirebaseService } from '../../firebase';
import { MemberTypeSummary } from './member-type-summary.model';
import { Observable } from 'rxjs';

@Injectable()
export class MemberTypeSummaryService {

    list: Observable<MemberTypeSummary[]>;
    
    constructor(private fs: FirebaseService) {}

    getList() {
        this.list = this.fs.getItems(MemberTypeSummary.TableName());
    }

    getListByYear(year: string) {
        this.list = this.fs.getItems(MemberTypeSummary.TableName(), 'year', year);
    }

    getListByYearRange(startYear:string, endYear:string) {
        this.list = this.fs.getItemsByRange(MemberTypeSummary.TableName(), 'year', startYear, endYear);
    }

    addItem(model: MemberTypeSummary) { 
        let data = MemberTypeSummary.setData(model);
        this.fs.addItem(MemberTypeSummary.TableName(), data);
    }
    
    updateItem(item:any, model: MemberTypeSummary) {
        let data = MemberTypeSummary.setData(model);
        this.fs.updateItem(MemberTypeSummary.TableName(), item.key, data);
    }

    deleteItem(item:any) {
        this.fs.deleteItem(MemberTypeSummary.TableName(), item.key);
    }

    deleteAllItems() {
        this.fs.deleteAllItems(MemberTypeSummary.TableName());
    }
}
