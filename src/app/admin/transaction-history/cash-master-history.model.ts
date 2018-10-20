export class CashMasterHistory {
    memberNo: string;
    transDate: string;
    checkNo: string;
    checkDate: string;
    checkAmt: string;
    currencyCode: string;
    comments: string;
    batchNo: string;

    constructor(
        memberNo?: string,
        transDate?: string,
        checkNo?: string,
        checkDate?: string,
        checkAmt?: string,
        currencyCode?: string,
        comments?: string,
        batchNo?: string
    ) {
        this.memberNo = (memberNo) ? memberNo : '';
        this.transDate = (transDate) ? transDate : '';
        this.checkNo = (checkNo) ? checkNo : '';
        this.checkDate = (checkDate) ? checkDate : '';
        this.checkAmt = (checkAmt) ? checkAmt : '';
        this.currencyCode = (currencyCode) ? currencyCode : '';
        this.comments = (comments) ? comments : '';
        this.batchNo = (batchNo) ? batchNo : '';
    }

    public static TableName(): string {
        return 'cashMasterHistory';
    }

    public static setData(model:CashMasterHistory): any {
        return {
            memberNo: ((model.memberNo) ? model.memberNo : ''), 
            transDate: ((model.transDate) ? model.transDate : ''), 
            checkNo: ((model.checkNo) ? model.checkNo : ''), 
            checkDate: ((model.checkDate) ? model.checkDate : ''), 
            checkAmt: ((model.checkAmt) ? model.checkAmt : ''), 
            currencyCode: ((model.currencyCode) ? model.currencyCode : ''), 
            comments: ((model.comments) ? model.comments : ''), 
            batchNo: ((model.batchNo) ? model.batchNo : ''), 
        };
    }
}