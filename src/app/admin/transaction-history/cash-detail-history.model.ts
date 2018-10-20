export class CashDetailHistory {
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
        return 'cashDetailHistory';
    }

    public static setData(model:CashDetailHistory): any {
        return {
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
