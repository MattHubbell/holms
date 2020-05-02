import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { TitleService } from '../title.service';
import { Member, MemberService } from '../members';
import { TransactionCode, TransactionCodeService } from '../admin/transaction-codes';
import { CashMaster, CashMasterService, CashDetail, CashDetailService } from '../admin/cash-entry';
import { CashMasterHistory, CashMasterHistoryService, CashDetailHistory, CashDetailHistoryService } from '../admin/transaction-history';
import { MemberStatus, MemberStatusService } from '../admin/member-status';
import { MemberType, MemberTypeService } from '../admin/member-types';

@Component({
    templateUrl: './list-exports.component.html',
    styleUrls: [ './list-exports.component.css' ],
    animations: [
        trigger('detailExpand', [
          state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
          state('expanded', style({ height: '*', visibility: 'visible' })),
          transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
      ],
})

export class ListExportsComponent implements OnInit, OnDestroy {

    today = new Date;
    firstDay = new Date;
    datePipe = new DatePipe('en-US');
    currencyPipe = new CurrencyPipe('en-US');

    displayedColumns = ['select', 'tableName', 'rowCount'];
    dataSource = new MatTableDataSource<ElementData>(ELEMENT_DATA);
    selection = new SelectionModel<ElementData>(true, []);
    isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
    expandedElement: any;

    elementData: ElementData[] = [];
    subscription: Array<Subscription>;
    
    /* options is currently not working; need to check back with dev team */
    options = { 
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true, 
        showTitle: false,
        useBom: true
      };

    color = 'primary';
    mode = 'indeterminate';
    value = 50;
    displayProgressSpinner = false;
    spinnerWithoutBackdrop = false;
  
    constructor(
        private memberService: MemberService,
        private transactionCodeService: TransactionCodeService, 
        private cashMasterService: CashMasterService,
        private cashDetailService: CashDetailService,
        private cashMasterHistoryService: CashMasterHistoryService,
        private cashDetailHistoryService: CashDetailHistoryService,
        private memberStatusService: MemberStatusService,
        private memberTypeService: MemberTypeService,
        private titleService: TitleService,
        public snackBar: MatSnackBar 
        
    ) { 
        this.titleService.selector = 'list-exports';
        this.subscription = new Array<Subscription>();
    }

    ngOnInit() {
        // this.showProgressSpinner();
        this.displayProgressSpinner = true;
        let counter:number = 0;
        const max:number = 8;
        const today = new Date()
        this.today = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        this.firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        this.dataSource = new MatTableDataSource<ElementData>(this.elementData);

        const elementMembers = {tableName: 'Members', allRows: true, rowCount: 0, detailRow: {startMemberNo: 0, endMemberNo: 0}, rows: Array<ExportMember>()};
        this.elementData.push(elementMembers);
        this.getMembers(elementMembers).then(() => {
            counter = this.incrementCounter(counter, max);
        });

        const elementTransactionCodes = {tableName: 'Transaction Codes', allRows: true, rowCount: 0 , detailRow: null, rows: Array<TransactionCode>()};
        this.elementData.push(elementTransactionCodes);
        this.getTransactionCodes(elementTransactionCodes).then(() => {
            counter = this.incrementCounter(counter, max);
        });

        const elementCashMaster = {tableName: 'Cash Master', allRows: true, rowCount: 0, detailRow: {startDate: this.datePipe.transform(this.firstDay, 'yyyy-MM-dd'), endDate: this.datePipe.transform(this.today, 'yyyy-MM-dd')}, rows: Array<ExportCashMaster>()};
        this.elementData.push(elementCashMaster);
        this.getCashMaster(elementCashMaster).then(() => {
            counter = this.incrementCounter(counter, max);
        });

        const elementCashDetail = {tableName: 'Cash Detail', allRows: true, rowCount: 0, detailRow: {startDate: this.datePipe.transform(this.firstDay, 'yyyy-MM-dd'), endDate: this.datePipe.transform(this.today, 'yyyy-MM-dd')}, rows: Array<ExportCashDetail>()};
        this.elementData.push(elementCashDetail);
        this.getCashDetails(elementCashDetail).then(() => {
            counter = this.incrementCounter(counter, max);
        });

        const elementCashMasterHistory = {tableName: 'Cash Master History', allRows: true, rowCount: 0, detailRow: {startDate: this.datePipe.transform(this.firstDay, 'yyyy-MM-dd 00:00:00'), endDate: this.datePipe.transform(this.today, 'yyyy-MM-dd 00:00:00')}, rows: Array<ExportCashMasterHistory>()};
        this.elementData.push(elementCashMasterHistory);
        this.getCashMasterHistory(elementCashMasterHistory).then(() => {
            counter = this.incrementCounter(counter, max);
        });

        const elementCashDetailHistory = {tableName: 'Cash Detail History', allRows: true, rowCount: 0, detailRow: {startDate: this.datePipe.transform(this.firstDay, 'yyyy-MM-dd 00:00:00'), endDate: this.datePipe.transform(this.today, 'yyyy-MM-dd 00:00:00')}, rows: Array<ExportCashDetailHistory>()};
        this.elementData.push(elementCashDetailHistory);
        this.getCashDetailHistory(elementCashDetailHistory).then(() => {
            counter = this.incrementCounter(counter, max);
        });

        const elementMemberStatuses = {tableName: 'Member Status', allRows: true, rowCount: 0 , detailRow: null, rows: Array<MemberStatus>()};
        this.elementData.push(elementMemberStatuses);
        this.getMemberStatuses(elementMemberStatuses).then(() => {
            counter = this.incrementCounter(counter, max);
        });

        const elementMemberTypes = {tableName: 'Member Types', allRows: true, rowCount: 0 , detailRow: null, rows: Array<MemberType>()};
        this.elementData.push(elementMemberTypes);
        this.getMemberTypes(elementMemberTypes).then(() => {
            counter = this.incrementCounter(counter, max);
        });
    }

    incrementCounter(counter:number, max:number) {
        counter +=1;
        if (counter >= max) {
            setTimeout(() => {
                this.displayProgressSpinner = false;
            }, 6000);
        }
        return counter;
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe());
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    getMembers(element:ElementData): Promise<any> {
        element.rows = new Array<ExportMember>();
        this.memberService.getList();
        return new Promise((resolve) => {
            this.subscription.push(this.memberService.list.subscribe(x => {
                resolve(this.loadMembers(element, x));
            }));
        });
    }

    loadMembers(element:ElementData, x:any) {
        const list = x.sort(Member.memberCompare);
        list.forEach((xx: Member) => {
            const member: ExportMember = new ExportMember();
            member.AddrLine1 = xx.addrLine1;
            member.AddrLine2 = xx.addrLine2
            member.AnniversaryDate = (xx.anniversary) ? this.datePipe.transform(xx.anniversary, 'MM-dd-yyyy') : undefined;
            member.AnnualName = xx.annualName;
            member.ARBook = xx.arBook;
            member.City = xx.city;
            member.Comments = xx.comments;
            member.Country = xx.country;
            member.EMailAddr = xx.eMailAddr;
            member.GiftFromMember = +xx.giftFromMember;
            member.HGBook = xx.hgBook;
            member.AlternateAddress = xx.isAlternateAddress;
            member.LastDuesYear = xx.lastDuesYear;
            member.MEBook = xx.meBook;
            member.MemberName = xx.memberName;
            member.MemberNo = +xx.memberNo;
            member.MemberStatus = xx.memberStatus;
            member.MemberType = xx.memberType;
            member.PaidThruDate = (xx.paidThruDate) ? this.datePipe.transform(xx.paidThruDate, 'MM-dd-yyyy') : undefined;
            member.Phone = xx.phone;
            member.NewMemberCertification = xx.printCertification;
            member.NewMemberCertificationDate = (xx.certificationDate) ? this.datePipe.transform(xx.certificationDate, 'MM-dd-yyyy') : undefined;
            member.Salutation = xx.salutation;
            member.SortName = xx.sortName;
            member.StartYear = xx.startYear;
            member.State = xx.state;
            member.Zip = xx.zip;
            element.rows.push(member);
        });
        element.rowCount = x.length;
        (element.detailRow as NumberRange).endMemberNo = (element.rows[x.length - 1] as ExportMember).MemberNo;
    }

    getTransactionCodes(element: ElementData): Promise<any> {
        element.rows = new Array<TransactionCode>();
        this.transactionCodeService.getList();
        return new Promise((resolve) => {
            this.subscription.push(this.transactionCodeService.list.subscribe(x => {
                resolve(this.loadTransactionCodes(element, x));
            }));
        });
    }

    loadTransactionCodes(element:ElementData, x:any) {
        x.forEach((xx: TransactionCode) => {
            const transactionCode = new TransactionCode();
            transactionCode.description = xx.description;
            transactionCode.id = xx.id;
            transactionCode.isGiftItem = xx.isGiftItem;
            transactionCode.itemType = xx.itemType;
            transactionCode.price = xx.price;
            transactionCode.quantityRequired = xx.quantityRequired; 
            element.rows.push(transactionCode);
        });
        element.rowCount = x.length;
    }

    getCashMaster(element:ElementData): Promise<any> {
        element.rows = new Array<ExportCashMaster>();
        this.cashMasterService.getList();
        return new Promise((resolve) => {
            this.subscription.push(this.cashMasterService.list.subscribe(x => {
                resolve(this.loadCashMaster(element, x));
            }));
        });
    }

    loadCashMaster(element:ElementData, x:any) {
        x.forEach((xx: CashMaster) => {
            const cashMaster = new ExportCashMaster();
            cashMaster.batchNo = +xx.batchNo;
            cashMaster.checkAmt = (xx.checkAmt) ? this.currencyPipe.transform(xx.checkAmt, 'USD') : undefined;
            cashMaster.checkDate = (xx.checkDate) ? this.datePipe.transform(xx.checkDate, 'MM-dd-yyyy') : undefined;
            cashMaster.checkNo = xx.checkNo;
            cashMaster.comments= xx.comments;
            cashMaster.currencyCode = xx.currencyCode;
            cashMaster.memberNo = +xx.memberNo;
            cashMaster.receiptNo = +xx.receiptNo;
            cashMaster.transDate = (xx.transDate) ? this.datePipe.transform(xx.transDate, 'MM-dd-yyyy') : undefined;
            element.rows.push(cashMaster);
        });
        element.rowCount = x.length;
    }

    getCashDetails(element:ElementData): Promise<any> {
        element.rows = new Array<ExportCashDetail>();
        this.cashDetailService.getList();
        return new Promise((resolve) => {
            this.subscription.push(this.cashDetailService.list.subscribe(x => {
                resolve(this.loadCashDetails(element, x));
            }));
        });
    }

    loadCashDetails(element:ElementData, x:any) {
        x.forEach((xx: CashDetail) => {
            const cashDetail = new ExportCashDetail();
            cashDetail.batchNo = +xx.batchNo;
            cashDetail.distAmt = (xx.distAmt) ? this.currencyPipe.transform(xx.distAmt, 'USD') : undefined;
            cashDetail.distQty = xx.distQty;
            cashDetail.duesCode = xx.duesCode;
            cashDetail.duesYear = +xx.duesYear;
            cashDetail.memberNo = +xx.memberNo;
            cashDetail.receiptNo = +xx.receiptNo;
            cashDetail.tranCode = xx.tranCode;
            cashDetail.transDate = new Date(xx.transDate).toLocaleDateString();
            element.rows.push(cashDetail);
        });
        element.rowCount = x.length;
    }

    getCashMasterHistory(element:ElementData): Promise<any> {
        element.rows = new Array<ExportCashMasterHistory>();
        this.cashMasterHistoryService.getList();
        return new Promise((resolve) => {
            this.subscription.push(this.cashMasterHistoryService.list.subscribe(x => {
                resolve(this.loadCashMasterHistory(element, x));
            }));
        });
    }
    getCashMasterHistoryByDateRange(element:ElementData, startDate:Date, endDate:Date): Promise<any> {
        element.rows = new Array<ExportCashMasterHistory>();
        this.cashMasterHistoryService.getListByDateRange(startDate, endDate);
        return new Promise((resolve) => {
            this.subscription.push(this.cashMasterHistoryService.list.subscribe(x => {
                resolve(this.loadCashMasterHistory(element, x));
            }));
        });
    }

    loadCashMasterHistory(element:ElementData, x:any) {
        x.forEach((xx: CashMasterHistory) => {
            const cashMasterHistory = new ExportCashMasterHistory();
            cashMasterHistory.batchNo = xx.batchNo;
            cashMasterHistory.checkAmt = (xx.checkAmt) ? this.currencyPipe.transform(xx.checkAmt, 'USD') : undefined;
            cashMasterHistory.checkDate = (xx.checkDate) ? this.datePipe.transform(xx.checkDate, 'MM-dd-yyyy') : undefined;
            cashMasterHistory.checkNo = xx.checkNo;
            cashMasterHistory.comments= xx.comments;
            cashMasterHistory.currencyCode = xx.currencyCode;
            cashMasterHistory.memberNo = +xx.memberNo;
            cashMasterHistory.receiptNo = +xx.receiptNo;
            cashMasterHistory.transDate = (xx.transDate) ? this.datePipe.transform(xx.transDate, 'MM-dd-yyyy') : undefined;
            element.rows.push(cashMasterHistory);
        });
        element.rowCount = x.length;
    }

    getCashDetailHistory(element:ElementData): Promise<any> {
        element.rows = new Array<ExportCashDetailHistory>();
        this.cashDetailHistoryService.getList();
        return new Promise((resolve) => {
            this.subscription.push(this.cashDetailHistoryService.list.subscribe(x => {
                resolve(this.loadCashDetailHistory(element, x));
            }));
        });
    }

    getCashDetailHistoryByDateRange(element:ElementData, startDate:Date, endDate:Date): Promise<any> {
        element.rows = new Array<ExportCashDetailHistory>();
        this.cashDetailHistoryService.getListByDateRange(startDate, endDate);
        return new Promise((resolve) => {
            this.subscription.push(this.cashDetailHistoryService.list.subscribe(x => {
                resolve(this.loadCashDetailHistory(element, x));
            }));
        });
    }
    loadCashDetailHistory(element:ElementData, x:any) {
        x.forEach((xx: CashDetailHistory) => {
            const cashDetailHistory = new ExportCashDetailHistory();
            cashDetailHistory.batchNo = xx.batchNo;
            cashDetailHistory.distAmt = (xx.distAmt) ? this.currencyPipe.transform(xx.distAmt, 'USD') : undefined;
            cashDetailHistory.distQty = xx.distQty;
            cashDetailHistory.duesCode = xx.duesCode;
            cashDetailHistory.duesYear = +xx.duesYear;
            cashDetailHistory.memberNo = +xx.memberNo;
            cashDetailHistory.receiptNo = +xx.receiptNo;
            cashDetailHistory.tranCode = xx.tranCode;
            cashDetailHistory.transDate = (xx.transDate) ? this.datePipe.transform(xx.transDate, 'MM-dd-yyyy') : undefined;
            element.rows.push(cashDetailHistory);
        });
        element.rowCount = x.length;
    }

    getMemberStatuses(element:ElementData): Promise<any> {
        element.rows = new Array<MemberStatus>();
        this.memberStatusService.getList();
        return new Promise((resolve) => {
            this.subscription.push(this.memberStatusService.list.subscribe(x => {
                resolve(this.loadMemberStatuses(element, x));
            }));
        });
    }

    loadMemberStatuses(element:ElementData, x:any) {
        x.forEach((xx: MemberStatus) => {
            const memberStatus = new MemberStatus();
            memberStatus.description = xx.description;
            memberStatus.id = xx.id;
            element.rows.push(memberStatus);
        });
        element.rowCount = x.length;
    }

    getMemberTypes(element:ElementData): Promise<any> {
        element.rows = new Array<MemberType>();
        this.memberTypeService.getList();
        return new Promise((resolve) => {
            this.subscription.push(this.memberTypeService.list.subscribe(x => {
                resolve(this.loadMemberTypes(element, x));
            }));
        });
    }

    loadMemberTypes(element:ElementData, x:any) {
        x.forEach((xx: MemberType) => {
            const memberType = new MemberType();
            memberType.description = xx.description;
            memberType.id = xx.id;
            memberType.level = xx.level;
            memberType.price = xx.price;
            element.rows.push(memberType);
        });
        element.rowCount = x.length;
    }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
    }

    onDownloadData() {
        let processed:boolean = false;
        let startDate:Date;
        let endDate:Date;
        this.selection.selected.forEach(element => {
            switch(element.tableName) {
                case 'Members':
                    if (element.allRows) {
                        new Angular2Csv(element.rows, 'MemberList', { headers: Object.keys(element.rows[0]) });  
                    } else {
                        let startMemberNo:number = (element.detailRow as NumberRange).startMemberNo;
                        let endMemberNo:number = (element.detailRow as NumberRange).endMemberNo;
                        let filteredMembers = element.rows.filter((x:ExportMember) => x.MemberNo >= startMemberNo && x.MemberNo <= endMemberNo);
                        new Angular2Csv(filteredMembers, 'MemberList', { headers: Object.keys(element.rows[0]) });  
                    }
                    break;      
                case 'Transaction Codes':
                    new Angular2Csv(element.rows, 'TransactionCodeList', { headers: Object.keys(element.rows[0]) });  
                    break;      
                case 'Cash Master':
                    startDate = new Date((element.detailRow as DateRange).startDate);
                    endDate = new Date((element.detailRow as DateRange).endDate);
                    new Angular2Csv(element.rows, 'CashMasterList', { headers: Object.keys(element.rows[0]) });  
                    break;      
                case 'Cash Detail':
                    startDate = new Date((element.detailRow as DateRange).startDate);
                    endDate = new Date((element.detailRow as DateRange).endDate);
                    new Angular2Csv(element.rows, 'CashDetailList', { headers: Object.keys(element.rows[0]) });  
                    break;      
                case 'Cash Master History':
                    if (element.allRows) {
                        new Angular2Csv(element.rows, 'CashMasterHistoryList', { headers: Object.keys(element.rows[0]) });  
                    } else {
                        startDate = new Date((element.detailRow as DateRange).startDate);
                        endDate = new Date((element.detailRow as DateRange).endDate);
                        this.getCashMasterHistoryByDateRange(element, startDate, endDate).then( () => {
                            new Angular2Csv(element.rows, 'CashMasterHistoryList', { headers: Object.keys(element.rows[0]) });  
                        });
                    }
                    break;      
                case 'Cash Detail History':
                    if (element.allRows) {
                        new Angular2Csv(element.rows, 'CashDetailHistoryList', { headers: Object.keys(element.rows[0]) });  
                    } else {
                        startDate = new Date((element.detailRow as DateRange).startDate);
                        endDate = new Date((element.detailRow as DateRange).endDate);
                        this.getCashDetailHistoryByDateRange(element, startDate, endDate).then( () => {
                            new Angular2Csv(element.rows, 'CashDetailHistoryList', { headers: Object.keys(element.rows[0]) });  
                        });
                    }
                    break;      
                case 'Member Status':
                    new Angular2Csv(element.rows, 'MemberStatusList', { headers: Object.keys(element.rows[0]) });  
                    break;      
                case 'Member Types':
                    new Angular2Csv(element.rows, 'MemberTypesList', { headers: Object.keys(element.rows[0]) });  
                    break;      
            }
            processed = true;
        });
        if (processed) {
            this.snackBar.open("File(s) downloaded","", {
                duration: 2000,
            });          
        }
    }

    // Display progress spinner for 3 secs on click of button
    showProgressSpinner = () => {
        this.displayProgressSpinner = true;
        setTimeout(() => {
        this.displayProgressSpinner = false;
        }, 6000);
    };

    showRange(elementData: ElementData, fieldType: string) {
        if (elementData.allRows) {
            return false;
        }
        if ( elementData == undefined || elementData.detailRow == undefined ) {
            return false;
        }
        if ( (elementData.detailRow as NumberRange).startMemberNo != undefined && fieldType == "numberRange" ) {
            return true;
        }
        if ( (elementData.detailRow as NumberRange).endMemberNo != undefined && fieldType == "numberRange" ) {
            return true;
        }
        if ( (elementData.detailRow as DateRange).startDate != undefined && fieldType == "dateRange" ) {
            return true;
        }
        if ( (elementData.detailRow as DateRange).endDate != undefined && fieldType == "dateRange" ) {
            return true;
        }
        return false;
    }
}

export interface ElementData {
    tableName: string;
    allRows: boolean;
    rowCount: number;
    detailRow: any;
    rows: any;
}

export interface NumberRange {
    startMemberNo: number;
    endMemberNo: number;
}

export interface DateRange {
    startDate: string;
    endDate: string;
}
  
const ELEMENT_DATA: ElementData[] = [
    {tableName: 'Members', allRows: true, rowCount: 1400 , detailRow: null, rows: null}
];
  
export class ExportMember {
    MemberNo: number;
    SortName: string;
    Salutation: string;
    MemberName: string;
    AddrLine1: string;
    AddrLine2: string;
    City: string;
    State: string;
    Zip: string;
    Country: string;
    Phone: string;
    HGBook: string;
    ARBook: string;
    MEBook: string;
    AnnualName: string;
    LastDuesYear: number;
    StartYear: number;
    MemberType: string;
    MemberStatus: string;
    EMailAddr: string;
    Comments: string;
    AlternateAddress: boolean;
    GiftFromMember: number;
    NewMemberCertification: boolean;
    NewMemberCertificationDate: string;
    AnniversaryDate: string;
    PaidThruDate: string; 
    
    constructor(
        memberNo?: number,
        sortName?: string,
        salutation?: string,
        memberName?: string,
        addrLine1?: string,
        addrLine2?: string,
        city?: string,
        state?: string,
        zip?: string,
        country?: string,
        phone?: string,
        hgBook?: string,
        arBook?: string,
        meBook?: string,
        annualName?: string,
        lastDuesYear?: number,
        startYear?: number,
        anniversary?: string,
        paidThruDate?: string, 
        memberType?: string,
        memberStatus?: string,
        eMailAddr?: string,
        comments?: string,
        isAlternateAddress?: boolean,
        giftFromMember?: number,
        printCertification?: boolean,
        certificationDate?: string
    ) {
        this.MemberNo = (memberNo) ? memberNo : 0;
        this.SortName = (sortName) ? sortName : '';
        this.Salutation = (salutation) ? salutation : '';
        this.MemberName = (memberName) ? memberName : '';
        this.AddrLine1 = (addrLine1) ? addrLine1 : '';
        this.AddrLine2 = (addrLine2) ? addrLine2 : '';
        this.City = (city) ? city.toUpperCase() : '';
        this.State = (state) ? state.toUpperCase() : '';
        this.Zip = (zip) ? zip.toUpperCase() : '';
        this.Country = (country) ? country.toUpperCase() : '';
        this.Phone = (phone) ? phone : '';
        this.HGBook = (hgBook) ? hgBook : '';
        this.ARBook = (arBook) ? arBook : '';
        this.MEBook = (meBook) ? meBook : '';
        this.AnnualName = (annualName) ? annualName : '';
        this.LastDuesYear = (lastDuesYear) ? lastDuesYear : 0;
        this.StartYear = (startYear) ? startYear : 0;
        this.MemberType = (memberType) ? memberType : '';
        this.MemberStatus = (memberStatus) ? memberStatus : '';
        this.EMailAddr = (eMailAddr) ? eMailAddr : '';
        this.Comments = (comments) ? comments : '';
        this.AlternateAddress = (isAlternateAddress) ? isAlternateAddress : false;
        this.GiftFromMember = (giftFromMember) ? giftFromMember : null;
        this.NewMemberCertification = (printCertification) ? printCertification : false;
        this.NewMemberCertificationDate = (certificationDate) ? certificationDate : null;
        this.AnniversaryDate = (anniversary) ? anniversary : null;
        this.PaidThruDate = (paidThruDate) ? paidThruDate : null; 
    }
}

export class ExportCashMaster {
    receiptNo: number;
    memberNo: number;
    transDate: string;
    checkNo: string;
    checkDate: string;
    checkAmt: string;
    currencyCode: string;
    comments: string;
    batchNo: number;

    constructor(
        receiptNo?: number,
        memberNo?: number,
        transDate?: string,
        checkNo?: string,
        checkDate?: string,
        checkAmt?: string,
        currencyCode?: string,
        comments?: string,
        batchNo?: number
    ) {
        this.receiptNo = (receiptNo) ? receiptNo : null;
        this.memberNo = (memberNo) ? memberNo : null;
        this.transDate = (transDate) ? transDate : null;
        this.checkNo = (checkNo) ? checkNo : '';
        this.checkDate = (checkDate) ? checkDate : null;
        this.checkAmt = (checkAmt) ? checkAmt : '';
        this.currencyCode = (currencyCode) ? currencyCode : '';
        this.comments = (comments) ? comments : '';
        this.batchNo = (batchNo) ? batchNo : null;
    }
}

export class ExportCashDetail {
    receiptNo: number;
    memberNo: number;
    transDate: string;
    tranCode: string;
    distAmt: string;
    distQty: number;
    duesCode: string;
    duesYear: number;
    batchNo: number;
    
    constructor(
        receiptNo?: number,
        memberNo?: number,
        transDate?: string,
        tranCode?: string,
        distAmt?: string,
        distQty?: number,
        duesCode?: string,
        duesYear?: number,
        batchNo?: number
        ) {
        this.receiptNo = (receiptNo) ? receiptNo : null;
        this.memberNo = (memberNo) ? memberNo : null;
        this.transDate = (transDate) ? transDate : null;
        this.tranCode = (tranCode) ? tranCode : '';
        this.distAmt = (distAmt) ? distAmt : '';
        this.distQty = (distQty) ? distQty : 0;
        this.duesCode = (duesCode) ? duesCode : '';
        this.duesYear = (duesYear) ? duesYear : 0;
        this.batchNo = (batchNo) ? batchNo : null;
    }
}

export class ExportCashMasterHistory {
    receiptNo: number;
    memberNo: number;
    transDate: string;
    checkNo: string;
    checkDate: string;
    checkAmt: string;
    currencyCode: string;
    comments: string;
    batchNo: string;

    constructor(
        receiptNo?: number,
        memberNo?: number,
        transDate?: string,
        checkNo?: string,
        checkDate?: string,
        checkAmt?: string,
        currencyCode?: string,
        comments?: string,
        batchNo?: string
    ) {
        this.receiptNo = (receiptNo) ? receiptNo : 0;
        this.memberNo = (memberNo) ? memberNo : 0;
        this.transDate = (transDate) ? transDate : null;
        this.checkNo = (checkNo) ? checkNo : '';
        this.checkDate = (checkDate) ? checkDate : null;
        this.checkAmt = (checkAmt) ? checkAmt : '';
        this.currencyCode = (currencyCode) ? currencyCode : '';
        this.comments = (comments) ? comments : '';
        this.batchNo = (batchNo) ? batchNo : '';
    }
}

export class ExportCashDetailHistory {
    receiptNo: number;
    memberNo: number;
    transDate: string;
    tranCode: string;
    distAmt: string;
    distQty: number;
    duesCode: string;
    duesYear: number;
    batchNo: string;

    constructor(
        receiptNo?: number,
        memberNo?: number,
        transDate?: string,
        tranCode?: string,
        distAmt?: string,
        distQty?: number,
        duesCode?: string,
        duesYear?: number,
        batchNo?: string
        ) {
        this.receiptNo = (receiptNo) ? receiptNo : 0;
        this.memberNo = (memberNo) ? memberNo : 0;
        this.transDate = (transDate) ? transDate : '';
        this.tranCode = (tranCode) ? tranCode : '';
        this.distAmt = (distAmt) ? distAmt : '';
        this.distQty = (distQty) ? distQty : 0;
        this.duesCode = (duesCode) ? duesCode : '';
        this.duesYear = (duesYear) ? duesYear : 0;
        this.batchNo = (batchNo) ? batchNo : '';
    }
}
