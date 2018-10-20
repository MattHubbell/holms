import { Component, Input, ViewEncapsulation, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { MatDialog, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ConfirmResponses } from '../../shared/modal/confirm-btn-default';

import { CashMaster } from './cash-master.model';
import { CashMasterService } from './cash-master.service';
import { CashDetail } from './cash-detail.model';
import { CashDetailService } from './cash-detail.service';
import { CashDetailModalContent } from './cash-detail.modal';
import { Salutations } from '../../shared';
import { Member, MemberService} from '../../members';
import { MemberType, MemberTypeService} from '../member-types';
import { MemberStatus, MemberStatusService } from '../member-status';
import { TransactionCode, TransactionCodeItemTypes, TransactionCodeService } from '../transaction-codes';
import { CashMasterHistoryService } from '../transaction-history/cash-master-history.service';

import { MatPaginator, MatTableDataSource } from '@angular/material';
import { JQueryService }  from '../../shared/jquery.service';
import * as f from '../../shared/functions';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { startWith } from 'rxjs/operators/startWith';
import { map } from 'rxjs/operators/map';
  
@Component({
    selector: 'cash-entry-modal-content',
    templateUrl: './cash-entry.modal.html',
    styleUrls: [ './cash-entry.modal.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class CashEntryModalContent {

    @Input() selectedItem: Observable<CashMaster>;
    @Input() model: CashMaster;
    maintForm: FormGroup;
    submitted: boolean;
    salutations = Salutations;
    members: Member[];
    memberTypes: MemberType[];
    memberStatuses: MemberStatus[];
    transactionCodes: TransactionCode[];
    isNewItem: Boolean;
    filteredMembers: Observable<Member[]>;
    selectedMember = new Member;
    checkDate: Date;
    transactionTotal: number;
    step = 0;
    entries: CashDetail[] = new Array<CashDetail>();
    dataSource = new MatTableDataSource<CashDetail>(this.entries);
    displayedColumns = ['tranCode', 'description', 'distQty', 'distAmt', 'duesCode', 'duesYear'];

    @ViewChild(MatPaginator) paginator: MatPaginator;

    subscription: Array<Subscription>;

    constructor(
        private formBuilder: FormBuilder,
        private cashMasterService: CashMasterService,
        private cashDetailService: CashDetailService,
        private memberService: MemberService, 
        private memberTypeService: MemberTypeService,
        private memberStatusService: MemberStatusService,
        private transactionCodeService: TransactionCodeService,
        private jQueryService: JQueryService, 
        private modalService: MatDialog,
        public dialogRef: MatDialogRef<CashMaster>
    ) {
        this.subscription = new Array<Subscription>();
        this.dataSource = new MatTableDataSource<CashDetail>(this.entries);
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
        this.subcribeToFormChanges();
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe);
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
        let member:Member = this.members.find(x => x.memberNo == memberNo);
        if (member) {
            let memberModel:Member = this.jQueryService.cloneObject(member);
            this.selectedMember = memberModel;
        }
    }

    subcribeToFormChanges() {
        const formValueChanges$ = this.maintForm.valueChanges;
        formValueChanges$.pipe(debounceTime(200))
                        //  .distinctUntilChanged())
                         .subscribe(x => {
            this.onValueChanged(x);
        });
        this.onValueChanged(); // (re)set validation messages now
    }

    resetForm() {
        if (typeof(this.model.checkDate) === 'string') {
            this.checkDate = new Date(this.model.checkDate);
        }
        this.maintForm = this.formBuilder.group({
            memberNo: [this.model.memberNo],
            memberName: [this.selectedMember.memberName],
            addrLine1: [this.selectedMember.addrLine1],
            addrLine2: [this.selectedMember.addrLine2],
            city: [this.selectedMember.city],
            state: [this.selectedMember.state],
            zip: [this.selectedMember.zip],
            transDate: [this.model.transDate],
            checkNo: this.model.checkNo,
            checkDate:  this.checkDate,
            checkAmt: [this.model.checkAmt],
            currencyCode: [this.model.currencyCode],
            comments: [this.model.comments],
            batchNo: [this.model.batchNo],
        });
        this.filteredMembers = this.maintForm.get('memberNo').valueChanges
            .pipe(
                startWith<string | Member>(''),
                map(value => typeof value === 'string' ? value : value.memberNo),
                map(memberNo => memberNo ? this.filter(memberNo) : this.members.slice())
        );

        this.onMemberNoChange(this.model.memberNo);

        this.subscription.push(this.cashDetailService
            .getItemByID(this.model.memberNo)
            .subscribe(x => {
                this.entries = x;
                this.dataSource = new MatTableDataSource<CashDetail>(this.entries);
                this.dataSource.paginator = this.paginator;
                this.dataSource.filterPredicate = (data: CashDetail, filter: string) => data.checkNo == this.model.checkNo;
                this.dataSource.filter = this.model.checkNo;
                this.transactionTotal = 0;
                this.entries.forEach(cashDetail => {
                    this.transactionTotal += +cashDetail.distAmt;
                });        
            })
        );
    }

    onValueChanged(data?: any) {
        if (!this.maintForm) { return; }
        const form = this.maintForm;

        for (const field in this.formErrors) {
            // clear previous error message (if any)
            this.formErrors[field] = '';
            const control = form.get(field);

            if (control && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    formErrors = {
    };

    validationMessages = {
    };

    onErrorState(control: FormControl, form: FormGroupDirective | NgForm): boolean {
        // Error when invalid control is dirty, touched, or submitted
        const isSubmitted = form && form.submitted;
        return !!(control.invalid && (control.dirty || control.touched || isSubmitted));
    }

    find(tranCode:string): TransactionCode {
        if (this.transactionCodes) {
            let transactionCode:TransactionCode = this.transactionCodes.find(x => x.id == tranCode);
            return transactionCode;
        }
        return null;
    }

    onSubmit(item:any, isValid:boolean) {
        if(!isValid) {
            return;
        }
        if (item.checkDate instanceof Date) {
            item.checkDate = item.checkDate.toLocaleDateString();
        }
        if (this.isNewItem) {
            this.cashMasterService.addItem(item);
        } else {
            this.cashMasterService.updateItem(this.selectedItem, item);
        }
        this.dialogRef.close();
    }

    onDelete($event:ConfirmResponses) {
        if ($event === ConfirmResponses.yes) {
            this.entries.forEach(cashDetail => {
                if (cashDetail.checkNo == this.model.checkNo) {
                    let selectedCashDetail = this.cashDetailService.getItemByKey(cashDetail['key']);
                    this.cashDetailService.deleteItem(selectedCashDetail);
                }
            });
            this.cashMasterService.deleteItem(this.selectedItem);
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

    addNew() {
        const modalRef = this.modalService.open(CashDetailModalContent);
        let model:CashDetail = new CashDetail();
        model.memberNo = this.model.memberNo;
        model.batchNo = this.model.batchNo;
        model.transDate = this.model.transDate;
        model.checkNo = this.model.checkNo;
        modalRef.componentInstance.isNewItem = true;
        modalRef.componentInstance.model = model;
        modalRef.componentInstance.transactionCodes = this.transactionCodes;
    }

    edit(object:any) {        
        const modalRef = this.modalService.open(CashDetailModalContent);
        modalRef.componentInstance.isNewItem = false;
        modalRef.componentInstance.transactionCodes = this.transactionCodes;
        modalRef.componentInstance.selectedItem = this.cashDetailService.getItemByKey(object['key']);
        this.subscription.push(modalRef.componentInstance.selectedItem.subscribe(x => {
            modalRef.componentInstance.model = this.jQueryService.cloneObject(x);
            modalRef.componentInstance.resetForm();
        }));
    }

}

