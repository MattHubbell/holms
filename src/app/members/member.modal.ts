import { Component, Input, ViewChild, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MatPaginator, MatDialog, MatDialogConfig } from '@angular/material';
import { ConfirmResponses } from '../shared/modal/confirm-btn-default';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

import { Member } from './member.model';
import { MemberService } from './member.service';
import { MemberType, MemberTypeService} from '../admin/member-types';
import { MemberStatus, MemberStatusService } from '../admin/member-status';
import { MembershipUser, MembershipUserService } from '../admin/membership-users';
import { CashMasterHistory } from '../admin/transaction-history/cash-master-history.model';
import { CashMasterHistoryService } from '../admin/transaction-history/cash-master-history.service';
import { Setup, SetupService } from "../admin/setup";
import { Salutations, Countries } from '../shared';
import { CashMasterHistoryModalContent } from '../admin/transaction-history/cash-master-history.modal';

@Component({
    selector: 'member-modal-content',
    templateUrl: './member.modal.html',
    styleUrls: [ './member.modal.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class MemberModalContent implements OnInit, OnDestroy {

    @Input() selectedItem: Observable<Member>;
    @Input() model: Member;
    @Input() members: Member[];
    @Input() isNewItem: Boolean;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    isSubmitted: boolean;
    tableName: string;
    salutations = Salutations;
	countries = Countries;
    memberTypes: MemberType[];
    memberStatuses: MemberStatus[];
    membershipUser: MembershipUser;
    setup: Setup;
    subscription: Array<Subscription>;
    selectedTabIndex: number;
    entries: CashMasterHistory[];
    dataSource = new MatTableDataSource<CashMasterHistory>(this.entries);
    displayedColumns = ['transDate', 'checkNo', 'checkDate', 'checkAmt'];
    modalRef: MatDialogRef<any,any>;
    dialogConfig: MatDialogConfig;
  
    constructor(
        private memberService: MemberService,
        private memberTypeService: MemberTypeService,
        private memberStatusService: MemberStatusService,
        private membershipUserService: MembershipUserService,
        private setupService: SetupService,
        private cashMasterHistoryService: CashMasterHistoryService,
        private modalService: MatDialog,
        public snackBar: MatSnackBar, 
        public dialogRef: MatDialogRef<MemberModalContent>
    ) {
        this.subscription = new Array<Subscription>();
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
        this.setupService.getItem();
        this.subscription.push(this.setupService.item
            .subscribe((x: Setup) => {
                if (x) {
                    this.setup = x;
                }
            })
        );
    }

    ngOnInit() {
        this.isSubmitted = false;
        this.tableName = Member.TableName();
        this.membershipUser = new MembershipUser();
        if (this.model.memberNo) {
            this.subscription.push(this.membershipUserService
                .getItemByID(this.model.memberNo)
                .subscribe((x: MembershipUser) => {
                    this.membershipUser = x[0];
                })
            );
            this.cashMasterHistoryService.getListByMemberNo(this.model.memberNo);
            this.subscription.push(this.cashMasterHistoryService.list
                .subscribe(x => {
                    this.entries = x.sort(CashMasterHistory.transDateCompare);
                    this.dataSource = new MatTableDataSource<CashMasterHistory>(this.entries);
                    this.dataSource.paginator = this.paginator;
                })
            );    
        }
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe());
    }

    onAssignMemberNo() {
        this.model.memberNo = this.setup.nextMemberNo.toString();
        this.setup.nextMemberNo += 1;
        this.setupService.updateItem(this.setup);
    }

    onSubmit(isValid:boolean) {
        this.isSubmitted = true;
        if(!isValid) {
            return;
        }
        if (this.isNewItem) {
            this.memberService.addItem(this.model);
            this.snackBar.open("Member added","", {
                duration: 2000,
            });          
        } else {
            this.memberService.updateItem(this.selectedItem, this.model);
            this.snackBar.open("Member updated","", {
                duration: 2000,
            });          
        }
        this.dialogRef.close();
    }

    onDelete($event:ConfirmResponses) {
        if ($event === ConfirmResponses.yes) {
            this.memberService.deleteItem(this.selectedItem);
            this.snackBar.open("Member deleted","", {
                duration: 2000,
            });          
            this.dialogRef.close();
        }
    }

    onClose() {
        // console.log(this.model.paidThruDate);
        // console.log(new Date(this.model.paidThruDate).toLocaleDateString());
        this.dialogRef.close();
    }

    displayCashEntry(cashMasterHistory: any) {
        this.modalRef = this.modalService.open(CashMasterHistoryModalContent, this.dialogConfig);
        this.modalRef.componentInstance.members = this.members;
        this.modalRef.componentInstance.isNewItem = false;
        this.modalRef.componentInstance.selectedItem = cashMasterHistory;
        this.modalRef.componentInstance.model = CashMasterHistory.clone(cashMasterHistory);
    }
}
