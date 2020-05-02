import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';

import { Setup, SetupService } from '../admin/setup';
import { MembershipDues } from './membership-dues.model';
import { MembershipDuesService } from './membership-dues.service';
import { Member, MemberService } from '../members';
import { MembershipUserType } from '../admin/membership-users'
import { MemberType, MemberTypeService } from '../admin/member-types';
import { TransactionCode, TransactionCodeItemTypes } from '../admin/transaction-codes';
import { TransactionCodeService } from '../admin/transaction-codes';
import { TitleService } from '../title.service';
import { AppService } from '../app.service';
import { MatSnackBar } from '@angular/material';
import { PayPalSubmit } from './paypal.component';
import { UserModalComponent } from '../admin/user/user.modal';

import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

@Component( {
    selector: 'membership-dues',
    templateUrl: './membership-dues.component.html',
    styleUrls: [ './membership-dues.component.css' ],
    encapsulation: ViewEncapsulation.None
})

export class MembershipDuesComponent implements OnInit, OnDestroy {

    @ViewChild('memberNo') memberNo: ElementRef; 

    member: Member;
    model: MembershipDues;
    setup: Setup;
    selectedItem: any;
    transactionCodes: TransactionCode[];
    level1: MemberType;
    level2: MemberType;
    level3: MemberType;
    level4: MemberType;
    level5: MemberType;
    minPrice: number;
    onlineEntry: boolean;
    superUser: boolean;
    filteredMembers: Observable<Member[]>;
    members: Member[];
    submitButtonText: string;
    subscription: Array<Subscription>;
    editUserIsOpen: boolean;

    constructor(
        private setupService: SetupService,
        private membershipDuesService: MembershipDuesService,
        private memberService: MemberService,
        private memberTypeService: MemberTypeService,
        private transactionCodeService: TransactionCodeService,
        private titleService: TitleService,
        private appService: AppService,
        private modalService: MatDialog,
        private dialog: MatDialog, 
        public snackBar: MatSnackBar
    ) {
        this.subscription = new Array<Subscription>();
        this.setupService.getItem()
        this.subscription.push(this.setupService.item.subscribe(x => {
            this.setup = x;
        }));
        this.titleService.selector = 'membership-dues';
        this.editUserIsOpen = false;
    }

    ngOnInit() {
        this.subscription = new Array<Subscription>();
        this.onlineEntry = true;
        if (this.appService.membershipUser) {
            this.superUser = ((this.appService.membershipUser.userType == MembershipUserType.Treasurer || this.appService.membershipUser.userType == MembershipUserType.Administrator) ? false : true);
            this.onlineEntry = this.superUser;
        }
        this.model = new MembershipDues;
        this.resetForm();
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe());
        this.subscription = new Array<Subscription>();
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
            let memberModel:Member = Member.clone(member);
            this.member = memberModel;
        }
    }

    resetForm() {
        if (this.onlineEntry) {
            this.model.memberNo = this.appService.membershipUser.memberId;
            this.submitButtonText = 'Purchase';
        } else {
            this.submitButtonText = "Post to Cash Entry";
        }
        this.memberService.getList();
        this.subscription.push(this.memberService.list
            .subscribe( x=> {
                this.members = x;
            })
        );
        this.member = new Member();
        this.subscription.push(this.memberService.getItemByMemberID(this.model.memberNo)
            .subscribe(x => {
                if (this.model.memberNo.length > 0) {
                    this.member = x[0];
                }
            })
        );
        this.memberTypeService.getList();
        this.subscription.push(this.memberTypeService.list
            .subscribe(x => {
                this.model.memberTypes = x.sort(this.compareNumbersDescending);
                this.level1 = x.filter(x =>x.level == 1)[0];
                this.level2 = x.filter(x =>x.level == 2)[0];
                this.level3 = x.filter(x =>x.level == 3)[0];
                this.level4 = x.filter(x =>x.level == 4)[0];
                this.level5 = x.filter(x =>x.level == 5)[0];
                this.minPrice = +this.level5.price;
                this.model.duesAmount = this.minPrice;
            })
        );
        this.transactionCodeService.getList();
        this.subscription.push(this.transactionCodeService.list
            .subscribe(x => {
                this.transactionCodes = x.filter(x => x.itemType != TransactionCodeItemTypes.Product);
                this.model.foundationLit = x.filter(x => x.itemType == TransactionCodeItemTypes.Foundation)[0].description;
                this.model.museum_libraryLit = x.filter(x => x.itemType == TransactionCodeItemTypes.MuseumLibary)[0].description;
                this.model.scholarshipLit = x.filter(x => x.itemType == TransactionCodeItemTypes.ScholarshipFund)[0].description;
            })
        );
        // this.filteredMembers = this.memberNo.nativeElement.valueChanges
        //     .pipe(
        //         startWith<string | Member>(''),
        //         map(member => this.filter(member.memberNo) )
        // );
    }

    compareNumbersDescending(a:MemberType,b:MemberType) {
        return +b.price - +a.price;
    }

    onSwitch() {
        this.onlineEntry = (!this.onlineEntry);
        this.resetForm();
    }

    submitPayment(isValid:boolean) {
        if(!isValid) {
            return;
        }
        this.calculateNewDuesPaidThruDate();
        if (this.onlineEntry) {
            this.openPayPalsubmit();
        } else {
            this.membershipDuesService.postCashEntry(this.model, this.member, this.setup, this.transactionCodes);
            this.snackBar.open('Posted to Cash Entry','', {
                duration: 2000,
            });
        }
        this.ngOnInit();
    }

    calculateNewDuesPaidThruDate() {
        const currentDate = new Date();
        const yyyy: number = currentDate.getFullYear() + this.model.duesQuantity;
        let paidThruDate: Date = new Date();
        paidThruDate.setFullYear(yyyy);
        this.model.duesPaidThruDate = paidThruDate;
    }

    openPayPalsubmit() {
        const modalRef = this.dialog.open(PayPalSubmit);
        modalRef.componentInstance.title  = "Complete your purchase"
        modalRef.componentInstance.message = "By clicking the PayPal button, you will be redirected to a secure popup window that allow you to make your payment. PayPal offers the option to make payments as a PayPal member, or you may choose to pay with a Debit or Credit Card through a guest account ";
        modalRef.componentInstance.isValid = true;
        modalRef.componentInstance.setup = this.setup;
        modalRef.componentInstance.member = this.member;
        modalRef.componentInstance.model = this.model;
        modalRef.componentInstance.transactionCodes = this.transactionCodes;
        modalRef.componentInstance.onClose = (x => {
            modalRef.close();
            this.resetForm();
        }) 
    }

    editUser() {
        if (this.editUserIsOpen) return;
        if (this.model.memberNo != '') {
            let userSubscription = this.memberService.getItemByMemberID(this.model.memberNo)
              .subscribe(x => {
                this.openUserModal(x[0]);
                userSubscription.unsubscribe();
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
        modalRef.componentInstance.model = Member.clone(member);
        modalRef.afterClosed().subscribe(() => {
          this.editUserIsOpen = false;
        });
      }    
}
