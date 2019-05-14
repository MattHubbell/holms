import { Component, Input, ViewEncapsulation, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogRef, MatDialogConfig } from '@angular/material';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ConfirmResponses } from '../../shared/modal/confirm-btn-default';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
  
import { CashMasterHistory } from './cash-master-history.model';
import { CashMasterHistoryService } from './cash-master-history.service';
import { CashDetailHistory } from './cash-detail-history.model';
import { CashDetailHistoryService } from './cash-detail-history.service';
import { CashDetailHistoryModalContent } from './cash-detail-history.modal';
import { Salutations } from '../../shared';
import { Member } from '../../members/member.model';
import { MemberType, MemberTypeService} from '../member-types';
import { MemberStatus, MemberStatusService } from '../member-status';
import { TransactionCode, TransactionCodeService } from '../transaction-codes';

@Component({
    selector: 'cash-master-history-modal-content',
    templateUrl: './cash-master-history.modal.html',
    styleUrls: [ './cash-master-history.modal.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class CashMasterHistoryModalContent implements OnInit, OnDestroy {

    @Input() selectedItem: Observable<CashMasterHistory>;
    @Input() model: CashMasterHistory;
    @Input() members: Member[];
    salutations = Salutations;
    memberTypes: MemberType[];
    memberStatuses: MemberStatus[];
    transactionCodes: TransactionCode[];
    isNewItem: Boolean;
    selectedMember = new Member;
    remaining: number;
    step = 0;
    entries: CashDetailHistory[] = new Array<CashDetailHistory>();
    dataSource = new MatTableDataSource<CashDetailHistory>(this.entries);
    displayedColumns = ['tranCode', 'description', 'distQty', 'distAmt', 'duesCode', 'duesYear'];
    dialogConfig: MatDialogConfig;
    modalRef: MatDialogRef<any,any>;
    selectedTabIndex: number;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild('form') ngForm: NgForm;

    subscription: Array<Subscription>;

    constructor(
        private cashMasterHistoryService: CashMasterHistoryService,
        private cashDetailHistoryService: CashDetailHistoryService,
        private memberTypeService: MemberTypeService,
        private memberStatusService: MemberStatusService,
        private transactionCodeService: TransactionCodeService,
        private modalService: MatDialog,
        public dialogRef: MatDialogRef<CashMasterHistory>,
        private snackBar: MatSnackBar
    ) {
        this.subscription = new Array<Subscription>();
        this.dataSource = new MatTableDataSource<CashDetailHistory>(this.entries);
        this.dataSource.paginator = this.paginator;
        this.memberTypeService.getList();
        this.subscription.push(this.memberTypeService.list
            .subscribe(x => {
                this.memberTypes = x;
            })
        );
        this.memberStatusService.getList();
        this.subscription.push(this.memberStatusService.list
            .subscribe(x => {
                this.memberStatuses = x;
            })
        );
        this.transactionCodeService.getList();
        this.subscription.push(this.transactionCodeService.list
            .subscribe(x => {
                this.transactionCodes = x;
            })
        );
    }

    ngOnInit() {
        this.resetForm();
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe());
    }
    
    filter(memberNo: string): Member[] {
        return this.members.filter(member =>
          member.memberNo.indexOf(memberNo) === 0);
    }
    
    displayFn(memberNo?: string): string | undefined {
        return memberNo ? memberNo : undefined;
    }

    onMemberNoChange(memberNo:any) {
        if (!this.members) {
            return;
        } 
        this.selectedMember = new Member();
        let member:Member = this.members.find(x => x.memberNo == memberNo);
        if (member) {
            let memberModel:Member = Member.clone(member);
            this.selectedMember = memberModel;
            this.entries.forEach((cashDetail:CashDetailHistory) => {
                cashDetail.memberNo = member.memberNo;
            });
        }
    }

    onCheckAmtChange() {
        this.calculateRemaining();
    }

    calculateRemaining() {
        this.remaining = +this.model.checkAmt;
        this.entries.forEach(cashDetail => {
            this.remaining -= ((cashDetail.distQty != 0) ? (cashDetail.distAmt * cashDetail.distQty) : cashDetail.distAmt);
        });        
    }

    resetForm() {
        this.onMemberNoChange(this.model.memberNo);
        this.entries = new Array<CashDetailHistory>();
        this.dataSource = new MatTableDataSource<CashDetailHistory>(this.entries);
        if (this.model.receiptNo.length > 0) {
            this.cashDetailHistoryService.getListByID(this.model.receiptNo);
            this.subscription.push(this.cashDetailHistoryService.list
                .subscribe(x => {
                    this.entries = x;
                    this.dataSource = new MatTableDataSource<CashDetailHistory>(this.entries);
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.filterPredicate = (data: CashDetailHistory, filter: string) => data.receiptNo == this.model.receiptNo;
                    this.dataSource.filter = this.model.receiptNo;
                    this.calculateRemaining();
                })
            );
        }
    }

    find(tranCode:string): TransactionCode {
        if (this.transactionCodes) {
            let transactionCode:TransactionCode = this.transactionCodes.find(x => x.id == tranCode);
            return transactionCode;
        }
        return null;
    }

    onSubmit(isValid:boolean) {
        if(!isValid) {
            this.snackBar.open('Unable to save, check for required fields.','', {
                duration: 2000,
            });    
            return;
        }
        if (this.remaining != 0) {
            this.snackBar.open('Unable to save, line item total not equal to check amt.','', {
                duration: 2000,
            });    
            return;
        }
        if (this.isNewItem) {
            this.cashMasterHistoryService.addItem(this.model);
        } else {
            this.cashMasterHistoryService.updateItem(this.selectedItem, this.model);
        }
        this.entries.forEach((cashDetail:CashDetailHistory) => {
            this.cashDetailHistoryService.updateItem(cashDetail, cashDetail);
        });
        this.dialogRef.close();
    }

    onDelete($event:ConfirmResponses) {
        if ($event === ConfirmResponses.yes) {
            this.entries.forEach(cashDetail => {
                if (cashDetail.receiptNo == this.model.receiptNo) {
                    this.cashDetailHistoryService.deleteItem(cashDetail);
                }
            });
            if (!this.isNewItem) {
                this.cashMasterHistoryService.deleteItem(this.selectedItem);
            }
            this.dialogRef.close();
        }
    }

    onClose($event:any) {
        this.dialogRef.close();
    }
    
    setStep(index: number) {
      this.step = index;
    }
  
    nextStep() {
      this.step++;
    }
  
    prevStep() {
      this.step--;
    }

    edit(object:any) {
        this.dialogConfig = new MatDialogConfig;
        this.dialogConfig.autoFocus = false;
        this.modalRef = this.modalService.open(CashDetailHistoryModalContent, this.dialogConfig);
        this.modalRef.componentInstance.transactionCodes = this.transactionCodes;
        this.modalRef.componentInstance.isNewItem = false;
        this.modalRef.componentInstance.selectedItem = object;
        this.modalRef.componentInstance.model = CashDetailHistory.clone(object);
    }
}
