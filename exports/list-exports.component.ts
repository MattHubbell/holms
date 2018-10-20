import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TitleService } from '../title.service';
import { Member, MemberService } from '../members';
import { TransactionCode, TransactionCodeService } from '../admin/transaction-codes';
import { CashMasterHistory, CashMasterHistoryService, CashDetailHistory, CashDetailHistoryService } from '../admin/transaction-history';
import { MemberStatus, MemberStatusService } from '../admin/member-status';
import { MemberType, MemberTypeService } from '../admin/member-types';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { Angular2Csv } from 'angular2-csv/Angular2-csv';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './list-exports.component.html',
    styleUrls: [ './list-exports.component.css' ]
})

export class ListExportsComponent implements OnInit, OnDestroy {

    members: Member[];
    transactionCodes: TransactionCode[];
    cashMasterHistory: CashMasterHistory[];
    cashDetailHistory: CashDetailHistory[];
    memberStatus: MemberStatus[];
    memberTypes: MemberType[];
    displayedColumns = ['select', 'tableName', 'rowCount'];
    dataSource = new MatTableDataSource<ElementData>(ELEMENT_DATA);
    selection = new SelectionModel<ElementData>(true, []);
    elementData: ElementData[] = [];
    elementMembers: ElementData;
    elementTransactionCodes: ElementData;
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
        private formBuilder: FormBuilder, 
        private memberService: MemberService,
        private transactionCodeService: TransactionCodeService, 
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
        this.dataSource = new MatTableDataSource<ElementData>(this.elementData);
        this.elementMembers = {tableName: 'Members', rowCount: 0};
        this.elementData.push(this.elementMembers);
        this.memberService.getList();
        this.subscription.push(this.memberService.list
            .subscribe(x => {
                this.members = x;
                this.elementMembers.rowCount = x.length;
            })
        );
        this.elementTransactionCodes = {tableName: 'Transaction Codes', rowCount: 0};
        this.elementData.push(this.elementTransactionCodes);
        this.transactionCodeService.getList();
        this.subscription.push(this.transactionCodeService.list
            .subscribe(x => {
                this.transactionCodes = x;
                this.elementTransactionCodes.rowCount = x.length;
            })
        );
        this.elementCashMasterHistory = {tableName: 'Cash Master History', rowCount: 0};
        this.elementData.push(this.elementCashMasterHistory);
        this.cashMasterHistoryService.getList();
        this.subscription.push(this.cashMasterHistoryService.list
            .subscribe(x => {
                this.cashMasterHistory = x;
                this.elementCashMasterHistory.rowCount = x.length;
            })
        );
        this.elementCashDetailHistory = {tableName: 'Cash Detail History', rowCount: 0};
        this.elementData.push(this.elementCashDetailHistory);
        this.cashDetailHistoryService.getList();
        this.subscription.push(this.cashDetailHistoryService.list
            .subscribe(x => {
                this.cashDetailHistory = x;
                this.elementCashDetailHistory.rowCount = x.length;
            })
        );
        this.elementMemberStatuses = {tableName: 'Member Status', rowCount: 0};
        this.elementData.push(this.elementMemberStatuses);
        this.memberStatusService.getList();
        this.subscription.push(this.memberStatusService.list
            .subscribe(x => {
                this.memberStatus = x;
                this.elementMemberStatuses.rowCount = x.length;
            })
        );
        this.elementMemberTypes = {tableName: 'Member Types', rowCount: 0};
        this.elementData.push(this.elementMemberTypes);
        this.memberTypeService.getList();
        this.subscription.push(this.memberTypeService.list
            .subscribe(x => {
                this.memberTypes = x;
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
                case 'Cash Master History':
                    new Angular2Csv(this.cashMasterHistory, 'CashMasterHistoryList', { headers: Object.keys(this.cashMasterHistory[0]) });  
                    break;      
                case 'Cash Detail History':
                    new Angular2Csv(this.cashDetailHistory, 'CashDetailHistoryList', { headers: Object.keys(this.cashDetailHistory[0]) });  
                    break;      
                case 'Member Status':
                    new Angular2Csv(this.memberStatus, 'MemberStatusList', { headers: Object.keys(this.memberStatus[0]) });  
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
  