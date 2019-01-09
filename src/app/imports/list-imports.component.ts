import { Component, ViewChild, ElementRef, OnInit, OnDestroy  } from '@angular/core';
import { TitleService } from '../title.service';
import { Member, MemberService } from '../members';
import { TransactionCode, TransactionCodeService } from '../admin/transaction-codes';
import { CashMaster, CashMasterService, CashDetail, CashDetailService } from '../admin/cash-entry';
import { CashMasterHistory, CashMasterHistoryService, CashDetailHistory, CashDetailHistoryService } from '../admin/transaction-history';
import { MemberStatus, MemberStatusService } from '../admin/member-status';
import { MemberType, MemberTypeService } from '../admin/member-types';
import { MatTableDataSource } from '@angular/material';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './list-imports.component.html',
    styleUrls: [ './list-imports.component.css' ]
})

export class ListImportsComponent implements OnInit, OnDestroy  {

    @ViewChild("fileToUpload") fileToUpload:ElementRef;
    members: Member[];
    transactionCodes: TransactionCode[];
    cashMaster: CashMaster[];
    cashDetail: CashDetail[];
    cashMasterHistory: CashMasterHistory[];
    cashDetailHistory: CashDetailHistory[];
    memberStatus: MemberStatus[];
    memberTypes: MemberType[];
    displayedColumns = ['select', 'tableName', 'rowCount'];
    dataSource = new MatTableDataSource<ElementData>();
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
    csvArray: any;
    subscription: Array<Subscription>;

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
        this.titleService.selector = 'list-imports';
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
        this.elementCashMaster = {tableName: 'Cash Master', rowCount: 0};
        this.elementData.push(this.elementCashMaster);
        this.cashMasterService.getList();
        this.subscription.push(this.cashMasterService.list
            .subscribe(x => {
                this.cashMaster = x;
                this.elementCashMaster.rowCount = x.length;
            })
        );
        this.elementCashDetail = {tableName: 'Cash Detail', rowCount: 0};
        this.elementData.push(this.elementCashDetail);
        this.cashDetailService.getList();
        this.subscription.push(this.cashDetailService.list
            .subscribe(x => {
                this.cashDetail = x;
                this.elementCashDetail.rowCount = x.length;
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

    elementToggle() {
        this.selection.clear();
    }

    onUploadData() {
        let file:File = this.fileToUpload.nativeElement.files[0];
        let reader = new FileReader();
        reader.onload = this.handleReaderLoaded.bind(this);
        reader.readAsText(file);
    }

    handleReaderLoaded(e) {
        let reader = e.target;
        this.selection.selected.forEach(element => {
            switch(element.tableName) {
                case 'Members':
                    this.importMembers(reader.result);
                    break;      
                case 'Transaction Codes':
                    this.importTransactionCodes(reader.result);
                    break;      
                case 'Cash Master':
                    this.importCashMaster(reader.result);
                    break;      
                case 'Cash Detail':
                    this.importCashDetail(reader.result);
                    break;      
                case 'Cash Master History':
                    this.importCashMasterHistory(reader.result);
                    break;      
                case 'Cash Detail History':
                    this.importCashDetailHistory(reader.result);
                    break;      
                case 'Member Status':
                    this.importMemberStatuses(reader.result);
                    break;      
                case 'Member Types':
                    this.importMemberTypes(reader.result);
                    break;      
            }
        });
        this.snackBar.open("File(s) uploaded","", {
            duration: 2000,
        });          
    }

    importMembers(csvString:string) {
        let members:Member[] = this.csvToArray(Member, csvString);
        if (members.length == 0) {
            alert("No rows found!");
            return;
        }
        this.memberService.deleteAllItems();
        for (let index = 0; index < members.length; ++index) {
            let member = members[index];
            if (member.memberStatus.trim().length == 0) {
                member.memberStatus = 'A';
            }
        
            this.memberService.addItem(member);
        }
    }

    importTransactionCodes(csvString:string) {
        let transactionCodes:TransactionCode[] = this.csvToArray(TransactionCode, csvString);
        if (transactionCodes.length == 0) {
            alert("No rows found!");
            return;
        }
        this.transactionCodeService.deleteAllItems();
        for (let index = 0; index < transactionCodes.length; ++index) {
            this.transactionCodeService.addItem(transactionCodes[index]);
        }
    }

    importCashMaster(csvString:string) {
        let cashMaster:CashMaster[] = this.csvToArray(CashMaster, csvString);
        if (cashMaster.length == 0) {
            alert("No rows found!");
            return;
        }
        this.cashMasterService.deleteAllItems();
        for (let index = 0; index < cashMaster.length; ++index) {
            this.cashMasterService.addItem(cashMaster[index]);
        }
    }

    importCashDetail(csvString:string) {
        let cashDetail:CashDetail[] = this.csvToArray(CashDetail, csvString);
        if (cashDetail.length == 0) {
            alert("No rows found!");
            return;
        }
        this.cashDetailService.deleteAllItems();
        for (let index = 0; index < cashDetail.length; ++index) {
            this.cashDetailService.addItem(cashDetail[index]);
        }
    }

    importCashMasterHistory(csvString:string) {
        let cashMasterHistory:CashMasterHistory[] = this.csvToArray(CashMasterHistory, csvString);
        if (cashMasterHistory.length == 0) {
            alert("No rows found!");
            return;
        }
        this.cashMasterHistoryService.deleteAllItems();
        for (let index = 0; index < cashMasterHistory.length; ++index) {
            this.cashMasterHistoryService.addItem(cashMasterHistory[index]);
        }
    }

    importCashDetailHistory(csvString:string) {
        let cashDetailHistory:CashDetailHistory[] = this.csvToArray(CashDetailHistory, csvString);
        if (cashDetailHistory.length == 0) {
            alert("No rows found!");
            return;
        }
        this.cashDetailHistoryService.deleteAllItems();
        for (let index = 0; index < cashDetailHistory.length; ++index) {
            this.cashDetailHistoryService.addItem(cashDetailHistory[index]);
        }
    }

    importMemberStatuses(csvString:string) {
        let memberStatuses:MemberStatus[] = this.csvToArray(MemberStatus, csvString);
        if (memberStatuses.length == 0) {
            alert("No rows found!");
            return;
        }
        this.memberStatusService.deleteAllItems();
        for (let index = 0; index < memberStatuses.length; ++index) {
            this.memberStatusService.addItem(memberStatuses[index]);
        }
    }

    importMemberTypes(csvString:string) {
        let memberTypes:MemberType[] = this.csvToArray(MemberType, csvString);
        if (memberTypes.length == 0) {
            alert("No rows found!");
            return;
        }
        this.memberTypeService.deleteAllItems();
        for (let index = 0; index < memberTypes.length; ++index) {
            this.memberTypeService.addItem(memberTypes[index]);
        }
    }

    csvToArray<T>(obj: {new(): T; }, csvString:string) {
        // The array we're going to build
        let objArray:T[] = new Array<T>();
        // Break it into rows to start
        let csvRows = csvString.split(/\n/);
        // Take off the first line to get the headers, then split that into an array
        let csvHeaders = csvRows.shift().replace(/(?:\r\n|\r|\n)/g, '').split(';');
    
        // Loop through remaining rows
        for(let rowIndex = 0; rowIndex < (csvRows.length - 1); ++rowIndex){
            let rowArray = csvRows[rowIndex].replace(/(?:\r\n|\r|\n)/g, '').split(';');

            // Create a new row object to store our data.
            let rowObject:T = objArray[rowIndex] = new obj();
            
            // Then iterate through the remaining properties and use the headers as keys
            for(let propIndex = 0; propIndex < rowArray.length; ++propIndex){
                // Grab the value from the row array we're looping through...
                if (rowArray[propIndex]) {
                    let propValues = rowArray[propIndex].replace(/^"|"$/g,'').split(/(?:","|",|,)/g);
            
                    // ...also grab the relevant header (the RegExp in both of these removes quotes)
                    if (csvHeaders[propIndex]) {
                        let propLabels = csvHeaders[propIndex].replace(/^"|"$/g,'').split(',');
                        for (let labelIndex = 0; labelIndex < propLabels.length; ++labelIndex) {
                            let label = propLabels[labelIndex].trim();
                            if (typeof rowObject[propLabels[labelIndex]] === 'number') {
                                rowObject[label] = +propValues[labelIndex];
                            } else {
                                if (typeof rowObject[propLabels[labelIndex]] === 'boolean') {
                                    rowObject[label] = ((propValues[labelIndex] == 'TRUE') ? true : false) ;
                                } else {
                                    if (propValues[labelIndex] != undefined) {
                                        rowObject[label] = propValues[labelIndex].trim();
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
        return objArray;
    }

    OldcsvToArray<T>(obj: {new(): T; }, csvString:string) {
        // The array we're going to build
        let objArray:T[] = new Array<T>();
        // Break it into rows to start
        let csvRows = csvString.split(/\n/);
        // Take off the first line to get the headers, then split that into an array
        let csvHeaders = csvRows.shift().split(';');
    
        // Loop through remaining rows
        for(let rowIndex = 0; rowIndex < csvRows.length; ++rowIndex){
            let rowArray = csvRows[rowIndex].split(';');

            // Create a new row object to store our data.
            let rowObject:T = objArray[rowIndex] = new obj();
            
            // Then iterate through the remaining properties and use the headers as keys
            for(let propIndex = 0; propIndex < rowArray.length; ++propIndex){
                // Grab the value from the row array we're looping through...
                if (rowArray[propIndex]) {
                let propValues = rowArray[propIndex].replace(/^"|"$/g,'').split('","');
            
                    // ...also grab the relevant header (the RegExp in both of these removes quotes)
                    if (csvHeaders[propIndex]) {
                        let propLabels = csvHeaders[propIndex].replace(/^"|"$/g,'').split(',');
                    
                        for (let labelIndex = 0; labelIndex < propLabels.length; ++labelIndex) {
                            rowObject[propLabels[labelIndex]] = propValues[labelIndex];
                        }

                    }
                }
            }
        }
        return objArray;
    }

}

export interface ElementData {
    tableName: string;
    rowCount: number;
}
