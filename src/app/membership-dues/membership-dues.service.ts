import { Injectable } from '@angular/core';
import * as f from '../shared/functions';

import { JQueryService }                                    from '../shared/jquery.service';
import { EmailService }                                     from '../shared/email.service';
import { Setup }                                            from '../admin/setup';
import { MembershipDues }                                   from './membership-dues.model';
import { Member, MemberService }                            from '../members';
import { CashMaster, CashMasterService }                    from '../admin/cash-entry';
import { CashDetail, CashDetailService }                    from '../admin/cash-entry';
import { TransactionCode, TransactionCodeItemTypes }        from '../admin/transaction-codes';

@Injectable()
export class MembershipDuesService {

    constructor(
        private memberService: MemberService,
        private cashMasterService: CashMasterService,
        private cashDetailService: CashDetailService, 
        private jQueryService: JQueryService 
    ) {}

    public postCashEntry(item:MembershipDues, member: Member, setup: Setup, transactionCodes: TransactionCode[]): void {
        let memberModel:Member = this.jQueryService.cloneObject(member);
        let memberObservable:any = this.memberService.getItemByKey(member['key']);
        let memberType:string = item.membershipTypeId;
    
        memberModel.lastDuesYear = setup.duesYear - 1 + item.duesQuantity;
        memberModel.memberType = memberType;
        memberModel.memberStatus = 'A';

        this.memberService.updateItem(memberObservable, memberModel);

        let memberNo:string = memberModel.memberNo;
        let transDate:string = new Date().toLocaleString();
        let checkNo:string = item.checkNo.toString();
        let checkDate:string = item.checkDate.toDateString();
        let checkAmt:string = item.membershipTotal.toString();
        let comments:string = item.comments;

        this.createCashMaster(memberNo, transDate, checkDate, checkNo, checkAmt, comments)

        if (item.duesAmount > 0) {
            let tranCode:string = transactionCodes.filter(x => x.itemType == TransactionCodeItemTypes.Membership)[0].id;
            let distAmt:string = item.duesAmount.toString();
            let distQty:number = item.duesQuantity;
            let duesCode:string = item.membershipTypeId;
            let duesYear:number = memberModel.lastDuesYear;
            this.createCashDetail(memberNo, tranCode, transDate, checkNo, distQty, distAmt, duesCode, duesYear, comments)
        }
        if (item.foundation > 0) {
            let tranCode:string = transactionCodes.filter(x => x.itemType == TransactionCodeItemTypes.Foundation)[0].id;
            let distAmt:string = item.foundation.toString();
            let distQty:number = 1;
            let duesCode:string = '';
            let duesYear:number = 0;
            this.createCashDetail(memberNo, tranCode, transDate, checkNo, distQty, distAmt, duesCode, duesYear, comments)
        }
        if (item.museum_library > 0) {
            let tranCode:string = transactionCodes.filter(x => x.itemType == TransactionCodeItemTypes.MuseumLibary)[0].id;
            let distAmt:string = item.museum_library.toString();
            let distQty:number = 1;
            let duesCode:string = '';
            let duesYear:number = 0;
            this.createCashDetail(memberNo, tranCode, transDate, checkNo, distQty, distAmt, duesCode, duesYear, comments)
        }
        if (item.scholarship > 0) {
            let tranCode:string = transactionCodes.filter(x => x.itemType == TransactionCodeItemTypes.ScholarshipFund)[0].id;
            let distAmt:string = item.scholarship.toString();
            let distQty:number = 1;
            let duesCode:string = '';
            let duesYear:number = 0;
            this.createCashDetail(memberNo, tranCode, transDate, checkNo, distQty, distAmt, duesCode, duesYear, comments)
        }
    }
    
    createCashMaster(memberNo:string, transDateTime:string, checkDate:string, checkNo:string, checkAmt: string, comments: string) {
        let cashMaster: CashMaster = new CashMaster();
        cashMaster.memberNo = memberNo;
        cashMaster.transDate = transDateTime;
        cashMaster.checkDate = checkDate;
        cashMaster.checkNo = checkNo;
        cashMaster.currencyCode = 'USD';
        cashMaster.checkAmt = checkAmt;
        cashMaster.comments = comments;
        this.cashMasterService.addItem(cashMaster);
    }

    createCashDetail(memberNo:string, tranCode:string, transDate:string, checkNo:string, distQty:number, distAmt:string, duesCode:string, duesYear:number, comments: string) {
        let cashDetail: CashDetail = new CashDetail();
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
