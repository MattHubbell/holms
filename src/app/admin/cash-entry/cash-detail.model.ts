export class CashDetail {
    receiptNo: string;
    memberNo: string;
    transDate: string;
    checkNo: string;
    tranCode: string;
    distAmt: string;
    distQty: number;
    duesCode: string;
    duesYear: number;
    comments: string;
    batchNo: string;
    
    constructor(
        receiptNo?: string,
        memberNo?: string,
        transDate?: string,
        checkNo?: string,
        tranCode?: string,
        distAmt?: string,
        distQty?: number,
        duesCode?: string,
        duesYear?: number,
        comments?: string,
        batchNo?: string
        ) {
        this.receiptNo = (receiptNo) ? receiptNo : '';
        this.memberNo = (memberNo) ? memberNo : '';
        this.transDate = (transDate) ? transDate : '';
        this.checkNo = (checkNo) ? checkNo : '';
        this.tranCode = (tranCode) ? tranCode : '';
        this.distAmt = (distAmt) ? distAmt : '';
        this.distQty = (distQty) ? distQty : 0;
        this.duesCode = (duesCode) ? duesCode : '';
        this.duesYear = (duesYear) ? duesYear : 0;
        this.comments = (comments) ? comments : '';
        this.batchNo = (batchNo) ? batchNo : '';
    }

    public static TableName(): string {
        return 'cashDetail';
    }

    public static setData(model:CashDetail): any {
        return {
                receiptNo: ((model.receiptNo) ? model.receiptNo : ''), 
                memberNo: ((model.memberNo) ? model.memberNo : ''), 
                transDate: ((model.transDate) ? model.transDate : ''), 
                checkNo: ((model.checkNo) ? model.checkNo : ''), 
                tranCode: ((model.tranCode) ? model.tranCode : ''), 
                distAmt: ((model.distAmt) ? model.distAmt : 0), 
                distQty: ((model.distQty) ? model.distQty : 0), 
                duesCode: ((model.duesCode) ? model.duesCode : ''), 
                duesYear: ((model.duesYear) ? model.duesYear : 0), 
                comments: ((model.comments) ? model.comments : ''), 
                batchNo: ((model.batchNo) ? model.batchNo : ''), 
            };
        }
        
    }