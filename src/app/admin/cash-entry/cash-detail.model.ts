import * as f from '../../shared/functions';

import { toDatabaseDate } from "src/app/shared/functions";

export class CashDetail {
    receiptNo: string;
    memberNo: string;
    transDate: Date;
    tranCode: string;
    distAmt: number;
    distQty: number;
    duesCode: string;
    duesYear: number;
    batchNo: string;
    
    constructor(
        receiptNo?: string,
        memberNo?: string,
        transDate?: Date,
        tranCode?: string,
        distAmt?: number,
        distQty?: number,
        duesCode?: string,
        duesYear?: number,
        batchNo?: string
        ) {
        this.receiptNo = (receiptNo) ? receiptNo : '';
        this.memberNo = (memberNo) ? memberNo : '';
        this.transDate = (transDate) ? transDate : null;
        this.tranCode = (tranCode) ? tranCode : '';
        this.distAmt = (distAmt) ? distAmt : 0;
        this.distQty = (distQty) ? distQty : 0;
        this.duesCode = (duesCode) ? duesCode : '';
        this.duesYear = (duesYear) ? duesYear : 0;
        this.batchNo = (batchNo) ? batchNo : '';
    }

    public static clone(model: CashDetail): CashDetail {
        return f.clone(model);
    }

    public static TableName(): string {
        return 'cashDetail';
    }

    public static setData(model: CashDetail): any {
        return {
                receiptNo: ((model.receiptNo) ? model.receiptNo : ''), 
                memberNo: ((model.memberNo) ? model.memberNo : ''), 
                transDate: ((model.transDate) ? toDatabaseDate(model.transDate) : null), 
                tranCode: ((model.tranCode) ? model.tranCode : ''), 
                distAmt: ((model.distAmt) ? model.distAmt : 0), 
                distQty: ((model.distQty) ? model.distQty : 0), 
                duesCode: ((model.duesCode) ? model.duesCode : ''), 
                duesYear: ((model.duesYear) ? model.duesYear : 0), 
                batchNo: ((model.batchNo) ? model.batchNo : ''), 
            };
        }
        
    }
