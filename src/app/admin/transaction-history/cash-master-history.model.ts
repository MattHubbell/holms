import * as f from '../../shared/functions';

import { toDatabaseDate } from "src/app/shared/functions";

export class CashMasterHistory {
    receiptNo: string;
    memberNo: string;
    transDate: Date;
    checkNo: string;
    checkDate: Date;
    checkAmt: number;
    currencyCode: string;
    comments: string;
    batchNo: string;

    constructor(
        receiptNo?: string,
        memberNo?: string,
        transDate?: Date,
        checkNo?: string,
        checkDate?: Date,
        checkAmt?: number,
        currencyCode?: string,
        comments?: string,
        batchNo?: string
    ) {
        this.receiptNo = (receiptNo) ? receiptNo : '';
        this.memberNo = (memberNo) ? memberNo : '';
        this.transDate = (transDate) ? transDate : null;
        this.checkNo = (checkNo) ? checkNo : '';
        this.checkDate = (checkDate) ? checkDate : null;
        this.checkAmt = (checkAmt) ? checkAmt : 0;
        this.currencyCode = (currencyCode) ? currencyCode : '';
        this.comments = (comments) ? comments : '';
        this.batchNo = (batchNo) ? batchNo : '';
    }

    public static clone(model: CashMasterHistory): CashMasterHistory {
        return f.clone(model);
    }

    public static memberCompare(a: CashMasterHistory, b: CashMasterHistory) {
        const memberA = f.pad(+a.memberNo, 10);
        const memberB = f.pad(+b.memberNo, 10);
        if (memberA > memberB) {
            return 1;
        } else {
            if (memberA < memberB) {
                return -1;
            }
        }
        return 0;
    }

    public static transDateCompare(a: CashMasterHistory, b: CashMasterHistory) {
        const dateA = new Date(a.transDate); 
        const dateB = new Date(b.transDate); 
        if (dateA > dateB) {
            return 1;
        } else {
            if (dateA < dateB) {
                return -1;
            }
        }
        return 0;
    }

    public static TableName(): string {
        return 'cashMasterHistory';
    }

    public static setData(model:CashMasterHistory): any {
        return {
            receiptNo: ((model.receiptNo) ? model.receiptNo : ''), 
            memberNo: ((model.memberNo) ? model.memberNo : ''), 
            transDate: ((model.transDate) ? toDatabaseDate(model.transDate) : null), 
            checkNo: ((model.checkNo) ? model.checkNo : ''), 
            checkDate: ((model.checkDate) ? toDatabaseDate(model.checkDate) : null), 
            checkAmt: ((model.checkAmt) ? model.checkAmt : 0), 
            currencyCode: ((model.currencyCode) ? model.currencyCode : ''), 
            comments: ((model.comments) ? model.comments : ''), 
            batchNo: ((model.batchNo) ? model.batchNo : ''), 
        };
    }
}
