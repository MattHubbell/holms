import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatePipe, CurrencyPipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { TitleService } from '../title.service';
import { Member, MemberService } from '../members';
import { TransactionCode, TransactionCodeService } from '../admin/transaction-codes';
import { CashMaster, CashMasterService, CashDetail, CashDetailService } from '../admin/cash-entry';
import { CashMasterHistory, CashMasterHistoryService, CashDetailHistory, CashDetailHistoryService } from '../admin/transaction-history';
import { MemberStatus, MemberStatusService } from '../admin/member-status';
import { MemberType, MemberTypeService } from '../admin/member-types';
import * as f from '../shared/functions';

@Component({
    templateUrl: './list-exports.component.html',
    styleUrls: [ './list-exports.component.css' ]
})

export class ListExportsComponent implements OnInit, OnDestroy {

    members: Array<ExportMember>;
    transactionCodes: Array<TransactionCode>;
    cashMasters: Array<ExportCashMaster>;
    cashDetails: Array<ExportCashDetail>;
    cashMastersHistory: Array<ExportCashMasterHistory>;
    cashDetailsHistory: Array<ExportCashDetailHistory>;
    memberStatuses: Array<MemberStatus>;
    memberTypes: Array<MemberType>;

    displayedColumns = ['select', 'tableName', 'rowCount'];
    dataSource = new MatTableDataSource<ElementData>(ELEMENT_DATA);
    selection = new SelectionModel<ElementData>(true, []);
    
    elementData: ElementData[] = [];
    elementMembers: ElementData;
    elementTransactionCodes: ElementData;
    elementCashMaster: ElementData;
    elementCashDetail: ElementData;
    elementCashMasterHistory: ElementData;
    elementCashDetailHistory: ElementData;
    elementMemberStatuses: ElementData;
    elementMemberTypes: ElementData;
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
        const datePipe = new DatePipe('en-US');
        const currencyPipe = new  CurrencyPipe('en-US');
        this.dataSource = new MatTableDataSource<ElementData>(this.elementData);
        this.elementMembers = {tableName: 'Members', rowCount: 0};
        this.elementData.push(this.elementMembers);
        this.members = new Array<ExportMember>();
        this.memberService.getList();
        this.subscription.push(this.memberService.list
            .subscribe(x => {
                
                const list = x.sort(Member.memberCompare);

                list.forEach((xx: Member) => {
                    const member: ExportMember = new ExportMember();
                    member.AddrLine1 = xx.addrLine1;
                    member.AddrLine2 = xx.addrLine2
                    member.AnniversaryDate = (xx.anniversary) ? datePipe.transform(xx.anniversary, 'MM-dd-yyyy') : undefined;
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
                    member.PaidThruDate = (xx.paidThruDate) ? datePipe.transform(xx.paidThruDate, 'MM-dd-yyyy') : undefined;
                    member.Phone = xx.phone;
                    member.NewMemberCertification = xx.printCertification;
                    member.NewMemberCertificationDate = (xx.certificationDate) ? datePipe.transform(xx.certificationDate, 'MM-dd-yyyy') : undefined;
                    member.Salutation = xx.salutation;
                    member.SortName = xx.sortName;
                    member.StartYear = xx.startYear;
                    member.State = xx.state;
                    member.Zip = xx.zip;
                    this.members.push(member);
                });
                this.elementMembers.rowCount = x.length;
            })
        );
        this.elementTransactionCodes = {tableName: 'Transaction Codes', rowCount: 0};
        this.elementData.push(this.elementTransactionCodes);
        this.transactionCodes = new Array<TransactionCode>();
        this.transactionCodeService.getList();
        this.subscription.push(this.transactionCodeService.list
            .subscribe(x => {
                x.forEach((xx: TransactionCode) => {
                    const transactionCode = new TransactionCode();
                    transactionCode.description = xx.description;
                    transactionCode.id = xx.id;
                    transactionCode.isGiftItem = xx.isGiftItem;
                    transactionCode.itemType = xx.itemType;
                    transactionCode.price = xx.price;
                    transactionCode.quantityRequired = xx.quantityRequired; 
                    this.transactionCodes.push(transactionCode);
                });
                this.elementTransactionCodes.rowCount = x.length;
            })
        );
        this.elementCashMaster = {tableName: 'Cash Master', rowCount: 0};
        this.elementData.push(this.elementCashMaster);
        this.cashMasters = new Array<ExportCashMaster>();
        this.cashMasterService.getList();
        this.subscription.push(this.cashMasterService.list
            .subscribe(x => {
                x.forEach((xx: CashMaster) => {
                    const cashMaster = new ExportCashMaster();
                    cashMaster.batchNo = +xx.batchNo;
                    cashMaster.checkAmt = (xx.checkAmt) ? currencyPipe.transform(xx.checkAmt, 'USD') : undefined;
                    cashMaster.checkDate = (xx.checkDate) ? datePipe.transform(xx.checkDate, 'MM-dd-yyyy') : undefined;
                    cashMaster.checkNo = xx.checkNo;
                    cashMaster.comments= xx.comments;
                    cashMaster.currencyCode = xx.currencyCode;
                    cashMaster.memberNo = +xx.memberNo;
                    cashMaster.receiptNo = +xx.receiptNo;
                    cashMaster.transDate = (xx.transDate) ? datePipe.transform(xx.transDate, 'MM-dd-yyyy') : undefined;
                    this.cashMasters.push(cashMaster);
                });
                this.elementCashMaster.rowCount = x.length;
            })
        );
        this.elementCashDetail = {tableName: 'Cash Detail', rowCount: 0};
        this.elementData.push(this.elementCashDetail);
        this.cashDetails = new Array<ExportCashDetail>();
        this.cashDetailService.getList();
        this.subscription.push(this.cashDetailService.list
            .subscribe(x => {
                x.forEach((xx: CashDetail) => {
                    const cashDetail = new ExportCashDetail();
                    cashDetail.batchNo = +xx.batchNo;
                    cashDetail.distAmt = (xx.distAmt) ? currencyPipe.transform(xx.distAmt, 'USD') : undefined;
                    cashDetail.distQty = xx.distQty;
                    cashDetail.duesCode = xx.duesCode;
                    cashDetail.duesYear = xx.duesYear;
                    cashDetail.memberNo = +xx.memberNo;
                    cashDetail.receiptNo = +xx.receiptNo;
                    cashDetail.tranCode = xx.tranCode;
                    cashDetail.transDate = new Date(xx.transDate).toLocaleDateString();
                    this.cashDetails.push(cashDetail);
                });
                this.elementCashDetail.rowCount = x.length;
            })
        );
        this.elementCashMasterHistory = {tableName: 'Cash Master History', rowCount: 0};
        this.elementData.push(this.elementCashMasterHistory);
        this.cashMastersHistory = new Array<ExportCashMasterHistory>();
        this.cashMasterHistoryService.getList();
        this.subscription.push(this.cashMasterHistoryService.list
            .subscribe(x => {
                x.forEach((xx: CashMasterHistory) => {
                    const cashMasterHistory = new ExportCashMasterHistory();
                    cashMasterHistory.batchNo = xx.batchNo;
                    cashMasterHistory.checkAmt = (xx.checkAmt) ? currencyPipe.transform(xx.checkAmt, 'USD') : undefined;
                    cashMasterHistory.checkDate = (xx.checkDate) ? datePipe.transform(xx.checkDate, 'MM-dd-yyyy') : undefined;
                    cashMasterHistory.checkNo = xx.checkNo;
                    cashMasterHistory.comments= xx.comments;
                    cashMasterHistory.currencyCode = xx.currencyCode;
                    cashMasterHistory.memberNo = +xx.memberNo;
                    cashMasterHistory.receiptNo = +xx.receiptNo;
                    cashMasterHistory.transDate = (xx.transDate) ? datePipe.transform(xx.transDate, 'MM-dd-yyyy') : undefined;
                    this.cashMastersHistory.push(cashMasterHistory);
                });
                this.elementCashMasterHistory.rowCount = x.length;
            })
        );
        this.elementCashDetailHistory = {tableName: 'Cash Detail History', rowCount: 0};
        this.elementData.push(this.elementCashDetailHistory);
        this.cashDetailsHistory = new Array<ExportCashDetailHistory>();
        this.cashDetailHistoryService.getList();
        this.subscription.push(this.cashDetailHistoryService.list
            .subscribe(x => {
                x.forEach((xx: CashDetailHistory) => {
                    const cashDetailHistory = new ExportCashDetailHistory();
                    cashDetailHistory.batchNo = xx.batchNo;
                    cashDetailHistory.distAmt = (xx.distAmt) ? currencyPipe.transform(xx.distAmt, 'USD') : undefined;
                    cashDetailHistory.distQty = xx.distQty;
                    cashDetailHistory.duesCode = xx.duesCode;
                    cashDetailHistory.duesYear = xx.duesYear;
                    cashDetailHistory.memberNo = +xx.memberNo;
                    cashDetailHistory.receiptNo = +xx.receiptNo;
                    cashDetailHistory.tranCode = xx.tranCode;
                    cashDetailHistory.transDate = (xx.transDate) ? datePipe.transform(xx.transDate, 'MM-dd-yyyy') : undefined;
                    this.cashDetailsHistory.push(cashDetailHistory);
                });
                this.elementCashDetailHistory.rowCount = x.length;
            })
        );
        this.elementMemberStatuses = {tableName: 'Member Status', rowCount: 0};
        this.elementData.push(this.elementMemberStatuses);
        this.memberStatuses = new Array<MemberStatus>();
        this.memberStatusService.getList();
        this.subscription.push(this.memberStatusService.list
            .subscribe(x => {
                x.forEach((xx: MemberStatus) => {
                    const memberStatus = new MemberStatus();
                    memberStatus.description = xx.description;
                    memberStatus.id = xx.id;
                    this.memberStatuses.push(memberStatus);
                });
                this.elementMemberStatuses.rowCount = x.length;
            })
        );
        this.elementMemberTypes = {tableName: 'Member Types', rowCount: 0};
        this.elementData.push(this.elementMemberTypes);
        this.memberTypes = new Array<MemberType>();
        this.memberTypeService.getList();
        this.subscription.push(this.memberTypeService.list
            .subscribe(x => {
                x.forEach((xx: MemberType) => {
                    const memberType = new MemberType();
                    memberType.description = xx.description;
                    memberType.id = xx.id;
                    memberType.level = xx.level;
                    memberType.price = xx.price;
                    this.memberTypes.push(memberType);
                });
                this.elementMemberTypes.rowCount = x.length;
            })
        );
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

  /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
    }

    onDownloadData() {
        let processed:boolean = false;
        this.selection.selected.forEach(element => {
            switch(element.tableName) {
                case 'Members':
                    new Angular2Csv(this.members, 'MemberList', { headers: Object.keys(this.members[0]) });  
                    break;      
                case 'Transaction Codes':
                    new Angular2Csv(this.transactionCodes, 'TransactionCodeList', { headers: Object.keys(this.transactionCodes[0]) });  
                    break;      
                case 'Cash Master':
                    new Angular2Csv(this.cashMasters, 'CashMasterList', { headers: Object.keys(this.cashMasters[0]) });  
                    break;      
                case 'Cash Detail':
                    new Angular2Csv(this.cashDetails, 'CashDetailList', { headers: Object.keys(this.cashDetails[0]) });  
                    break;      
                case 'Cash Master History':
                    new Angular2Csv(this.cashMastersHistory, 'CashMasterHistoryList', { headers: Object.keys(this.cashMastersHistory[0]) });  
                    break;      
                case 'Cash Detail History':
                    new Angular2Csv(this.cashDetailsHistory, 'CashDetailHistoryList', { headers: Object.keys(this.cashDetailsHistory[0]) });  
                    break;      
                case 'Member Status':
                    new Angular2Csv(this.memberStatuses, 'MemberStatusList', { headers: Object.keys(this.memberStatuses[0]) });  
                    break;      
                case 'Member Types':
                    new Angular2Csv(this.memberTypes, 'MemberTypesList', { headers: Object.keys(this.memberTypes[0]) });  
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
}

export interface ElementData {
    tableName: string;
    rowCount: number;
}
  
const ELEMENT_DATA: ElementData[] = [
    {tableName: 'Members', rowCount: 1400}
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
