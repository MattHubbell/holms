import { Component, OnInit, OnDestroy, Input, ViewEncapsulation } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { Subscription } from 'rxjs';

import { Member, MemberService } from '../../members';
import { AppService } from '../../app.service';
import { Salutations, Countries } from '../../shared';
import { MemberType, MemberTypeService} from '../member-types';
import { MemberStatus, MemberStatusService } from '../member-status';
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
  isAdmin: boolean;
  events: any[] = [];
  salutations = Salutations;
  countries = Countries;
  memberTypes: MemberType[];
  memberStatuses: MemberStatus[];
  subscription: Array<Subscription>;

  constructor(
    private memberService: MemberService, 
    private memberTypeService: MemberTypeService,
    private memberStatusService: MemberStatusService,
    private appService: AppService,
    private firebaseService: FirebaseService,
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
    this.memberService.updateItem(this.selectedItem, this.model);
    const item = Member.clone(this.selectedItem);
    if (f.camelCase(item.memberName) != f.camelCase(this.model.memberName)) {
      this.firebaseService.updateProfile(f.camelCase(this.model.memberName));
      this.appService.profileName = f.camelCase(this.model.memberName);
    }
    if (item.eMailAddr != this.model.eMailAddr) {
      this.firebaseService.changeEmail(this.model.eMailAddr);
    }
    this.snackBar.open("Account updated","", {
      duration: 2000,
    });    
    this.dialogRef.close();
  }

  onCancel() {
    this.dialogRef.close();
  }
}
