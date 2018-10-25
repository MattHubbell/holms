import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { TitleService } from '../../title.service';
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
import { TransactionCodeService, TransactionCode } from '../transaction-codes';
import { Setup, SetupService } from "../setup";
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { JQueryService } from '../../shared/jquery.service';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

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
        private jQueryService:JQueryService,
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

    assignReceiptNo(): string {
        let receiptNo:string = this.setup.nextCashEntryReceiptNo.toString();
        this.setup.nextCashEntryReceiptNo += 1;
        this.setupService.updateItem(this.setup);
        return receiptNo;
    }

    addNew() {
        this.modalRef = this.modalService.open(CashEntryModalContent, this.dialogConfig);
        this.modalRef.componentInstance.members = this.members;
        this.modalRef.componentInstance.isNewItem = true;
        let model:CashMaster = new CashMaster();
        model.receiptNo = this.assignReceiptNo();
        model.memberNo = '';
        model.batchNo = '';
        model.transDate =  new Date().toLocaleString();
        model.currencyCode = 'USD';
        this.modalRef.componentInstance.model = model;
    }

    edit(object:any) {        
        this.modalRef = this.modalService.open(CashEntryModalContent, this.dialogConfig);
        this.modalRef.componentInstance.members = this.members;
        this.modalRef.componentInstance.isNewItem = false;
        this.modalRef.componentInstance.selectedItem = object;
        this.modalRef.componentInstance.model = this.jQueryService.cloneObject(object);
    }

    setBatch() {
        this.selection.selected.forEach(cashMaster => {
            cashMaster.batchNo = this.batchNo;
            this.details.forEach(cashDetail => {
                if (cashDetail.checkNo == cashMaster.checkNo && cashDetail.memberNo == cashMaster.memberNo) {
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
        let cashMasterPosted: any = new Array<string>();
        this.entries.forEach(cashMaster => {
            if (cashMaster.batchNo == this.batchNo) {
                let cashMasterHistory:CashMasterHistory = new CashMasterHistory();
                cashMasterHistory.memberNo = cashMaster.memberNo;
                cashMasterHistory.transDate = cashMaster.transDate;
                cashMasterHistory.checkNo = cashMaster.checkNo;
                cashMasterHistory.checkDate = cashMaster.checkDate;
                cashMasterHistory.checkAmt = cashMaster.checkAmt;
                cashMasterHistory.currencyCode = cashMaster.currencyCode;
                cashMasterHistory.comments = cashMaster.comments;
                cashMasterHistory.batchNo = cashMaster.batchNo;
                this.cashMasterHistoryService.addItem(cashMasterHistory);
                cashMasterPosted.push(cashMaster['key']);
            }
        });
        let cashDetailPosted: any = new Array<string>();
        this.details.forEach(cashDetail => {
            if (cashDetail.batchNo == this.batchNo) {
                let cashDetailHistory:CashDetailHistory = new CashDetailHistory();
                cashDetailHistory.memberNo = cashDetail.memberNo;
                cashDetailHistory.checkNo = cashDetail.checkNo;
                cashDetailHistory.duesCode = cashDetail.duesCode;
                cashDetailHistory.duesYear = cashDetail.duesYear;
                cashDetailHistory.tranCode = cashDetail.tranCode;
                cashDetailHistory.transDate = cashDetail.transDate;
                cashDetailHistory.distQty = cashDetail.distQty;
                cashDetailHistory.distAmt = cashDetail.distAmt;
                cashDetailHistory.comments = cashDetail.comments;
                cashDetailHistory.batchNo = cashDetail.batchNo;
                this.cashDetailHistoryService.addItem(cashDetailHistory);
                cashDetailPosted.push(cashDetail['key']);
            }
        });
        cashMasterPosted.forEach(key => {
            let cashMaster = this.cashMasterService.getItemByKey(key);
            this.cashMasterService.deleteItem(cashMaster);
        });
        cashDetailPosted.forEach(key => {
            let cashDetail = this.cashDetailService.getItemByKey(key);
            this.cashDetailService.deleteItem(cashDetail);
        });
        this.snackBar.open('Posting Complete','', {
            duration: 2000,
        });
    }
}
