import { Injectable } from '@angular/core';

import { JQueryService }                                    from '../shared/jquery.service';
import { Setup, SetupService }                              from '../admin/setup';
import { MembershipDues }                                   from './membership-dues.model';
import { Member, MemberService }                            from '../members';
import { CashMaster, CashMasterService }                    from '../admin/cash-entry';
import { CashDetail, CashDetailService }                    from '../admin/cash-entry';
import { TransactionCode, TransactionCodeItemTypes }        from '../admin/transaction-codes';

@Injectable()
export class MembershipDuesService {

    constructor(
        private setupService: SetupService,
        private memberService: MemberService,
        private cashMasterService: CashMasterService,
        private cashDetailService: CashDetailService, 
        private jQueryService: JQueryService 
    ) {}

    assignReceiptNo(setup: Setup): string {
        let receiptNo:string = setup.nextCashEntryReceiptNo.toString();
        setup.nextCashEntryReceiptNo += 1;
        this.setupService.updateItem(setup);
        return receiptNo;
    }

    public postCashEntry(item:MembershipDues, member: Member, setup: Setup, transactionCodes: TransactionCode[]): void {
        let memberModel:Member = this.jQueryService.cloneObject(member);
        let memberType:string = item.membershipTypeId;
    
        memberModel.lastDuesYear = setup.duesYear - 1 + item.duesQuantity;
        memberModel.memberType = memberType;
        memberModel.memberStatus = 'A';

        this.memberService.updateItem(member, memberModel);

        let receiptNo:string = this.assignReceiptNo(setup);
        let memberNo:string = memberModel.memberNo;
        let transDate:string = new Date().toLocaleString();
        let checkNo:string = item.checkNo.toString();
        let checkDate:string = item.checkDate.toDateString();
        let checkAmt:string = item.membershipTotal.toString();
        let comments:string = item.comments;

        this.createCashMaster(receiptNo, memberNo, transDate, checkDate, checkNo, checkAmt, comments)

        if (item.duesAmount > 0) {
            let tranCode:string = transactionCodes.filter(x => x.itemType == TransactionCodeItemTypes.Membership)[0].id;
            let distAmt:string = item.duesAmount.toString();
            let distQty:number = item.duesQuantity;
            let duesCode:string = item.membershipTypeId;
            let duesYear:number = memberModel.lastDuesYear;
            this.createCashDetail(receiptNo, memberNo, tranCode, transDate, checkNo, distQty, distAmt, duesCode, duesYear, comments)
        }
        if (item.foundation > 0) {
            let tranCode:string = transactionCodes.filter(x => x.itemType == TransactionCodeItemTypes.Foundation)[0].id;
            let distAmt:string = item.foundation.toString();
            let distQty:number = 1;
            let duesCode:string = '';
            let duesYear:number = 0;
            this.createCashDetail(receiptNo, memberNo, tranCode, transDate, checkNo, distQty, distAmt, duesCode, duesYear, comments)
        }
        if (item.museum_library > 0) {
            let tranCode:string = transactionCodes.filter(x => x.itemType == TransactionCodeItemTypes.MuseumLibary)[0].id;
            let distAmt:string = item.museum_library.toString();
            let distQty:number = 1;
            let duesCode:string = '';
            let duesYear:number = 0;
            this.createCashDetail(receiptNo, memberNo, tranCode, transDate, checkNo, distQty, distAmt, duesCode, duesYear, comments)
        }
        if (item.scholarship > 0) {
            let tranCode:string = transactionCodes.filter(x => x.itemType == TransactionCodeItemTypes.ScholarshipFund)[0].id;
            let distAmt:string = item.scholarship.toString();
            let distQty:number = 1;
            let duesCode:string = '';
            let duesYear:number = 0;
            this.createCashDetail(receiptNo, memberNo, tranCode, transDate, checkNo, distQty, distAmt, duesCode, duesYear, comments)
        }
    }
    
    createCashMaster(receiptNo:string, memberNo:string, transDateTime:string, checkDate:string, checkNo:string, checkAmt: string, comments: string) {
        let cashMaster: CashMaster = new CashMaster();
        cashMaster.receiptNo = receiptNo;
        cashMaster.memberNo = memberNo;
        cashMaster.transDate = transDateTime;
        cashMaster.checkDate = checkDate;
        cashMaster.checkNo = checkNo;
        cashMaster.currencyCode = 'USD';
        cashMaster.checkAmt = checkAmt;
        cashMaster.comments = comments;
        this.cashMasterService.addItem(cashMaster);
    }

    createCashDetail(receiptNo:string, memberNo:string, tranCode:string, transDate:string, checkNo:string, distQty:number, distAmt:string, duesCode:string, duesYear:number, comments: string) {
        let cashDetail: CashDetail = new CashDetail();
        cashDetail.receiptNo = receiptNo;
        cashDetail.memberNo = memberNo;
        cashDetail.checkNo = checkNo;
        cashDetail.duesCode = duesCode;
        cashDetail.distQty = distQty;
        cashDetail.distAmt = distAmt;
        cashDetail.duesYear = duesYear;
        cashDetail.tranCode = tranCode;
        cashDetail.transDate = transDate;
        cashDetail.comments = comments;
        this.cashDetailService.addItem(cashDetail);
    }
}
