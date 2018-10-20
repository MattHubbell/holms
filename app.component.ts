import { Component, ViewChild, OnInit, HostListener, OnDestroy } from '@angular/core';
import { AppService } from './app.service';
import { TitleService } from './title.service';
import { MatDialog, MatSidenav, MatDialogConfig } from '@angular/material';
import { UserModalComponent } from './admin/user/user.modal';
import { MemberService } from './members'
import { JQueryService } from './shared/jquery.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]  
})
export class AppComponent implements OnInit, OnDestroy {

  @ViewChild('sidenav') sidenav:MatSidenav;
  @HostListener('window:resize', ['$event'])
    onResize(event) {
      if (this.app.isLoggedOn) {

      if (event.target.innerWidth < 768) {
        this.navMode = 'over';
        this.sidenav.close();
      }
      if (event.target.innerWidth > 768) {
        this.navMode = 'side';
        this.sidenav.open();
      }
    }   
  }

  navMode: string;
  editUserIsOpen: boolean;
  app: AppService;
  subscription: Subscription;

  constructor(
    private appService:AppService, 
    private titleService:TitleService,
    private memberService:MemberService,
    private jQueryService:JQueryService,
    private modalService: MatDialog
  ) {
    this.app = this.appService;
  }

  ngOnInit() {
    this.appService.sidenav = this.sidenav;
    this.navMode = this.appService.navMode;
    this.editUserIsOpen = false;
  }

  ngOnDestroy() {
    if (!this.subscription.closed) {
      this.subscription.unsubscribe();
    }
  }

  logout() {
    this.titleService.title = "Membership";
    this.appService.onLogout();
  }

  editUser() {
    if (this.editUserIsOpen) return;
    if (this.appService.membershipUser.memberId != '') {
        this.subscription = this.memberService.getItemByMemberID(this.appService.membershipUser.memberId)
          .subscribe(x => {
            this.openUserModal(x[0]);
        })
    }
  }

  openUserModal(member:any) {
    if (this.editUserIsOpen) return;
    this.editUserIsOpen = true;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const modalRef = this.modalService.open(UserModalComponent, dialogConfig);
    modalRef.componentInstance.selectedItem = member;
    modalRef.componentInstance.model = this.jQueryService.cloneObject(member);
    modalRef.afterClosed().subscribe(() => {
      this.editUserIsOpen = false;
      this.subscription.unsubscribe();
    });
  }
}
