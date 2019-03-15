import { Component } from "@angular/core";
import { MatDialogConfig, MatDialog } from "@angular/material";
import { Subscription } from "rxjs";

import { Member, MemberService } from '../../members'
import { TitleService } from '../../title.service';
import { UserModalComponent } from '../../admin/user/user.modal';
import { AppService } from "../../app.service";

@Component({
    selector: 'my-account',
    templateUrl: './user.component.html',
})
  export class UserComponent {

    app: AppService;
    subscription: Subscription;
  
    constructor(
        private memberService: MemberService,
        private titleService: TitleService,
        private appService: AppService,
        private modalService: MatDialog,
    ) {
        this.app = this.appService;
        this.titleService.selector = 'membership-dues';
        if (this.appService.membershipUser.memberId != '') {
            this.subscription = this.memberService.getItemByMemberID(this.appService.membershipUser.memberId)
              .subscribe(x => {
                this.openUserModal(x[0]);
            })
        }
    }

    openUserModal(member:any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        const modalRef = this.modalService.open(UserModalComponent, dialogConfig);
        modalRef.componentInstance.selectedItem = member;
        modalRef.componentInstance.model = Member.clone(member);
        modalRef.afterClosed().subscribe(() => {
            this.subscription.unsubscribe();
            this.app.navigateTo('/dashboard');
        });
    }
}