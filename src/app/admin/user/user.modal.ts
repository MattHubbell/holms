import { Component, OnInit, OnDestroy, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MatSnackBar, MatTableDataSource, MatPaginator, MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';

import { Member, MemberService } from '../../members';
import { AppService } from '../../app.service';
import { Salutations, Countries } from '../../shared';
import { MemberType, MemberTypeService} from '../member-types';
import { MemberStatus, MemberStatusService } from '../member-status';
import { InvoiceModalContent } from './invoice.modal';
import { CashMasterHistory } from '../transaction-history/cash-master-history.model';
import { CashMasterHistoryService } from '../transaction-history/cash-master-history.service';

import { FirebaseService } from '../../firebase';
import * as f from '../../shared/functions';

@Component({
  selector: 'user-modal',
  templateUrl: './user.modal.html',
  styleUrls: ['./user.modal.css'],
  encapsulation: ViewEncapsulation.None
})
export class UserModalComponent implements OnInit, OnDestroy {

  @Input() selectedItem: any;
  @Input() model: Member;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  isAdmin: boolean;
  events: any[] = [];
  salutations = Salutations;
  countries = Countries;
  memberTypes: MemberType[];
  memberStatuses: MemberStatus[];
  entries: CashMasterHistory[];
  dataSource = new MatTableDataSource<CashMasterHistory>(this.entries);
  displayedColumns = ['transDate', 'checkNo', 'checkDate', 'checkAmt'];
  subscription: Array<Subscription>;

  constructor(
    private memberService: MemberService, 
    private memberTypeService: MemberTypeService,
    private memberStatusService: MemberStatusService,
    private cashMasterHistoryService: CashMasterHistoryService,
    private appService: AppService,
    private firebaseService: FirebaseService,
    private modalService: MatDialog,
    public snackBar: MatSnackBar, 
    public dialogRef: MatDialogRef<Member>
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
    this.cashMasterHistoryService.getListByMemberNo(this.appService.membershipUser.memberId);
    this.subscription.push(this.cashMasterHistoryService.list
        .subscribe(x => {
            this.entries = x;
            this.dataSource = new MatTableDataSource<CashMasterHistory>(this.entries);
            this.dataSource.paginator = this.paginator;
        })
    );
}

  ngOnInit() {
    this.isAdmin = false;
    if (this.appService.membershipUser.userType == 4) {
      this.isAdmin = true;
    }
  }

  ngOnDestroy() {
    this.subscription.forEach(x => x.unsubscribe());
  }

  onSubmit(isValid:boolean) {
    if (!isValid) return;
    const item = Member.clone(this.selectedItem);
    if (f.camelCase(item.memberName) != f.camelCase(this.model.memberName)) {
      this.firebaseService.updateProfile(f.camelCase(this.model.memberName));
      this.appService.profileName = f.camelCase(this.model.memberName);
    }
    if (item.eMailAddr != this.model.eMailAddr) {
      this.firebaseService.changeEmail(this.model.eMailAddr)
      .then(() => {
        this.completeUpdateItem();
      })
      .catch(reason => {
        this.snackBar.open(reason.message,"", {
          duration: 2000,
        });
        return;    
      });
    } else {
      this.completeUpdateItem();
    }
  }

  completeUpdateItem() {
    this.memberService.updateItem(this.selectedItem, this.model);
    this.snackBar.open("Account updated","", {
      duration: 2000,
    });    
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }

  displayInvoice(cashMaster: any) {
    const modalRef = this.modalService.open(InvoiceModalContent);
    modalRef.componentInstance.member = this.model;
    modalRef.componentInstance.cashMaster = cashMaster;
  }
}
