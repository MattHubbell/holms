import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { CashMaster } from './cash-master.model';
import { CashMasterService } from './cash-master.service';
import { CashDetail } from './cash-detail.model';
import { CashDetailService } from './cash-detail.service';
import { CashMasterHistory } from '../transaction-history/cash-master-history.model';
import { CashMasterHistoryService } from '../transaction-history/cash-master-history.service';
import { CashDetailHistory } from '../transaction-history/cash-detail-history.model';
import { CashDetailHistoryService } from '../transaction-history/cash-detail-history.service';
import { CashEntryModalContent } from './cash-entry.modal';
import { CheckRegisterModalContent } from './check-register.modal';
import { DistributionSummaryModalContent } from './distribution-summary.modal';
import { MemberService, Member } from '../../members';
import { Setup, SetupService } from "../setup";
import { TransactionCodeService, TransactionCode } from '../transaction-codes';
import { TitleService } from '../../title.service';

@Component({
    templateUrl: './list-cash-entry.component.html',
    styleUrls: [ './list-cash-entry.component.css' ]
})

export class ListCashEntryComponent implements OnInit, OnDestroy {

    entries: CashMaster[];
    dataSource = new MatTableDataSource<CashMaster>(this.entries);
    displayedColumns = ['select', 'memberNo', 'memberName', 'transDate', 'checkNo', 'checkDate', 'checkAmt'];
    details: CashDetail[];
    members: Member[];
    transactionCodes: TransactionCode[];
    selection = new SelectionModel<CashMaster>(true, []);
    selectionTotal: number = 0;
    batchNo: string = '';
    setup: Setup;
    checkRegisterFlag: boolean = false;
    distributionSummaryFlag: boolean = false;
    subscription: Array<Subscription>;
    dialogConfig: MatDialogConfig;
    modalRef: MatDialogRef<any,any>;
    cashMasterPosted: Array<CashMaster>;
    cashDetailPosted: Array<CashDetail>;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private cashMasterService: CashMasterService,
        private cashDetailService: CashDetailService,
        private cashMasterHistoryService: CashMasterHistoryService,
        private cashDetailHistoryService: CashDetailHistoryService,
        private memberService: MemberService, 
        private transactionCodeService: TransactionCodeService,
        private setupService: SetupService,
        private titleService: TitleService,
        private modalService: MatDialog,
        private snackBar: MatSnackBar
    ) {
        this.subscription = new Array<Subscription>();
        this.titleService.selector = 'list-cash-entry';
        this.checkRegisterFlag = false;
        this.distributionSummaryFlag = false;
    }

    ngOnInit() {
        this.cashMasterService.getList();
        this.subscription.push(this.cashMasterService.list
            .subscribe(x => {
                this.entries = x;
                this.entries.forEach(cashMaster => cashMaster.batchNo = '');
                this.dataSource = new MatTableDataSource<CashMaster>(this.entries);
                this.dataSource.paginator = this.paginator;
            })
        );
        this.cashDetailService.getList();
        this.subscription.push(this.cashDetailService.list
            .subscribe(x => {
                this.details = x;
                this.details.forEach(cashDetail => cashDetail.batchNo = '');
            })
        );
        this.memberService.getList();
        this.subscription.push(this.memberService.list
            .subscribe(x => {
                this.members = x;
            })
        );
        this.transactionCodeService.getList();
        this.subscription.push(this.transactionCodeService.list
            .subscribe(x => {
                this.transactionCodes = x;
            })
        );
        this.setupService.getItem();
        this.subscription.push(this.setupService.item
            .subscribe(x => {
                this.setup = x;
            })
        );
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe);
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toUpperCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
        this.totalSelected();
    }

    selectionToggle(element:any) {
        this.selection.toggle(element);
        this.totalSelected();
    }

    totalSelected() {
        this.selectionTotal = 0;
        this.selection.selected.forEach(row => {
            let amt:number = +row.checkAmt;
            this.selectionTotal += amt;
        });   
    }

    find(memberNo:string): Member {
        if (this.members) {
            let member:Member = this.members.find(x => x.memberNo == memberNo);
            return member;
        }
        return null;
    }

    onAssignBatchNo() {
        this.batchNo = this.setup.nextCashEntryBatchNo.toString();
        this.setup.nextCashEntryBatchNo += 1;
        this.setupService.updateItem(this.setup);
    }

    async assignReceiptNo() {
        let receiptNo = await this.incrementReceiptNo(this.setup.nextCashEntryReceiptNo);
        this.setup.nextCashEntryReceiptNo = receiptNo + 1;
        this.setupService.updateItem(this.setup);
        return receiptNo.toString();
    }

    async incrementReceiptNo(receiptNo: number) {
        let resp = await this.validateReceiptNo(receiptNo);
        if (resp) {
            receiptNo += 1;
            return this.incrementReceiptNo(receiptNo);
        } else {
            return receiptNo;
        }   
    }

    async validateReceiptNo(receiptNo: number) {
        let resp = null;
        let val = await this.cashMasterHistoryService.getItemsByReceiptNoAsync(receiptNo.toString()).toPromise();
        if (val.length > 0) {
            resp = true;
        } else {
            val = await this.cashMasterService.getItemsByReceiptNoAsync(receiptNo.toString()).toPromise();
            if (val.length > 0) {
                resp = true;
            } else {
                resp = false;
            }
            resp = false;
        }
        return resp;
    }

    addNew() {
        this.modalRef = this.modalService.open(CashEntryModalContent, this.dialogConfig);
        this.modalRef.componentInstance.members = this.members;
        this.modalRef.componentInstance.isNewItem = true;
        let model:CashMaster = new CashMaster();
        this.assignReceiptNo().then(x => {
            model.receiptNo = x;
        });
        model.memberNo = '';
        model.batchNo = '';
        model.transDate =  new Date();
        model.currencyCode = 'USD';
        this.modalRef.componentInstance.model = model;
    }

    edit(object:any) {        
        this.modalRef = this.modalService.open(CashEntryModalContent, this.dialogConfig);
        this.modalRef.componentInstance.members = this.members;
        this.modalRef.componentInstance.isNewItem = false;
        this.modalRef.componentInstance.selectedItem = object;
        this.modalRef.componentInstance.model = CashMaster.clone(object);
    }

    setBatch() {
        this.selection.selected.forEach(cashMaster => {
            cashMaster.batchNo = this.batchNo;
            this.details.forEach(cashDetail => {
                if (cashDetail.receiptNo == cashMaster.receiptNo) {
                    cashDetail.batchNo = this.batchNo;
                }
            });
        });
    }

    getCheckRegister() {
        this.setBatch();
        this.checkRegisterFlag = true;
        const modalRef = this.modalService.open(CheckRegisterModalContent);
        modalRef.componentInstance.batchNo = this.batchNo;
        modalRef.componentInstance.cashMasters = this.selection.selected;
        modalRef.componentInstance.members = this.members;
    }

    getDistributionSummary() {
        this.setBatch();
        this.distributionSummaryFlag = true;
        const modalRef = this.modalService.open(DistributionSummaryModalContent);
        modalRef.componentInstance.batchNo = this.batchNo;
        modalRef.componentInstance.cashDetails = this.details;
        modalRef.componentInstance.transactionCodes = new Array<TransactionCode>();
        this.transactionCodes.forEach(transactionCode => {
            if (this.details.find(cashDetail => cashDetail.tranCode == transactionCode.id && cashDetail.batchNo == this.batchNo)) {
                modalRef.componentInstance.transactionCodes.push(transactionCode);
            }
        });
    }

    readyToPost(): boolean {
        return (this.checkRegisterFlag && this.distributionSummaryFlag);
    }

    post() {
        this.cashMasterPosted = new Array<CashMaster>();
        this.cashDetailPosted = new Array<CashDetail>();

        this.entries.forEach(cashMaster => {
            if (cashMaster.batchNo == this.batchNo) {
                this.postCashMaster(cashMaster);
            }
        });
        this.cashMasterPosted.forEach((cashMaster) => {
            this.cashMasterService.deleteItem(cashMaster);
        });
        this.cashDetailPosted.forEach((cashDetail) => {
            this.cashDetailService.deleteItem(cashDetail);
        });
        this.snackBar.open('Posting Complete','', {
            duration: 2000,
        });
    }

    postCashMaster(cashMaster: CashMaster) {
        let cashMasterHistory:CashMasterHistory = new CashMasterHistory();
        cashMasterHistory.receiptNo = cashMaster.receiptNo;
        cashMasterHistory.memberNo = cashMaster.memberNo;
        cashMasterHistory.transDate = cashMaster.transDate;
        cashMasterHistory.checkNo = cashMaster.checkNo;
        cashMasterHistory.checkDate = cashMaster.checkDate;
        cashMasterHistory.checkAmt = cashMaster.checkAmt;
        cashMasterHistory.currencyCode = cashMaster.currencyCode;
        cashMasterHistory.comments = cashMaster.comments;
        cashMasterHistory.batchNo = cashMaster.batchNo;
        this.cashMasterHistoryService.addItem(cashMasterHistory);
        this.cashMasterPosted.push(cashMaster);
        this.details.forEach(cashDetail => {
            if (cashDetail.batchNo == this.batchNo && cashDetail.receiptNo == cashMaster.receiptNo) {
                this.postCashDetail(cashDetail);
                if (cashDetail.duesCode.length > 0 ) {
                    let memberSubscription:Subscription = this.memberService.getItemByMemberID(cashMaster.memberNo)
                        .subscribe((member:Member) => {
                            console.log(member[0]);
                            this.updateMember(member[0], cashMaster, cashDetail);
                            memberSubscription.unsubscribe();
                        }
                    );
                }
            }
        });
    }

    postCashDetail(cashDetail: CashDetail) {
        let cashDetailHistory:CashDetailHistory = new CashDetailHistory();
        cashDetailHistory.receiptNo = cashDetail.receiptNo;
        cashDetailHistory.memberNo = cashDetail.memberNo;
        cashDetailHistory.transDate = cashDetail.transDate;
        cashDetailHistory.tranCode = cashDetail.tranCode;
        cashDetailHistory.distAmt = cashDetail.distAmt;
        cashDetailHistory.distQty = cashDetail.distQty;
        cashDetailHistory.duesCode = cashDetail.duesCode;
        cashDetailHistory.duesYear = cashDetail.duesYear;
        cashDetailHistory.batchNo = cashDetail.batchNo;
        this.cashDetailHistoryService.addItem(cashDetailHistory);
        this.cashDetailPosted.push(cashDetail);
}

    updateMember(member: Member, cashMaster: CashMaster, cashDetail: CashDetail) {
        let memberModel:Member = Member.clone(member);
    
        memberModel.lastDuesYear = this.setup.duesYear - 1 + cashDetail.distQty;
        memberModel.memberType = cashDetail.duesCode;
        memberModel.memberStatus = 'A';

        const currentDate = new Date(cashMaster.checkDate);
        const yyyy: number = currentDate.getFullYear() + cashDetail.distQty;
        let paidThruDate: Date = new Date(cashMaster.checkDate);
        paidThruDate.setFullYear(yyyy);
        memberModel.paidThruDate = paidThruDate;

        if (memberModel.anniversary === undefined) {
            const aniversary: Date = new Date(cashMaster.checkDate);
            memberModel.anniversary = aniversary;
        }

        this.memberService.updateItem(member, memberModel);
    }
}
