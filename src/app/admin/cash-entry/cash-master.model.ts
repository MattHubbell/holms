import * as f from '../../shared/functions';

import { toDatabaseDate } from "src/app/shared/functions";

export class CashMaster {
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

    public static clone(model: CashMaster): CashMaster {
        return f.clone(model);
    }

    public static TableName(): string {
        return 'cashMaster';
    }

    public static setData(model: CashMaster): any {
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