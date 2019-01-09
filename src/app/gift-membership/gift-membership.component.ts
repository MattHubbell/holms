import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { JQueryService } from '../shared/jquery.service';
import { Setup, SetupService } from '../admin/setup';
import { GiftMembership } from './gift-membership.model';
import { GiftMembershipService } from './gift-membership.service';
import { Member, MemberService } from '../members';
import { MemberType, MemberTypeService } from '../admin/member-types';
import { MembershipUserType } from '../admin/membership-users'
import { TitleService } from '../title.service';
import { AppService } from '../app.service';
import { MatSnackBar } from '@angular/material';
// import { PayPalSubmit } from './paypal.component';
import { Countries } from './../shared';

import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

@Component( {
    selector: 'gift-memberships',
    templateUrl: './gift-membership.component.html',
    styleUrls: [ './gift-membership.component.css' ],
    encapsulation: ViewEncapsulation.None
})

export class GiftMembershipComponent implements OnInit, OnDestroy {

    @ViewChild('memberNo') memberNo: ElementRef; 

    member: Member;
    model: GiftMembership;
    setup: Setup;
    selectedItem: any;
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
    countries = Countries;

    constructor(
        private setupService: SetupService,
        private giftMembershipService: GiftMembershipService,
        private memberService: MemberService,
        private memberTypeService: MemberTypeService,
        private jQueryService: JQueryService, 
        private titleService: TitleService,
        private appService: AppService,
        private dialog: MatDialog, 
        public snackBar: MatSnackBar
    ) {
        this.subscription = new Array<Subscription>();
        this.setupService.getItem()
        this.subscription.push(this.setupService.item.subscribe(x => {
            this.setup = x;
        }));
        this.titleService.selector = 'membership-dues';
    }

    ngOnInit() {
        this.subscription = new Array<Subscription>();
        this.onlineEntry = true;
        if (this.appService.membershipUser) {
            this.superUser = ((this.appService.membershipUser.userType == MembershipUserType.Treasurer || this.appService.membershipUser.userType == MembershipUserType.Administrator) ? false : true);
            this.onlineEntry = this.superUser;
        }
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
            let memberModel:Member = this.jQueryService.cloneObject(member);
            this.member = memberModel;
        }
    }

    resetForm() {
        this.model = new GiftMembership;
        if (this.onlineEntry) {
            this.model.donorMemberNo = this.appService.membershipUser.memberId;
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
        this.subscription.push(this.memberService.getItemByMemberID(this.model.donorMemberNo)
            .subscribe(x => {
                if (this.model.donorMemberNo.length > 0) {
                    this.member = x[0];
                }
            })
        );
        this.memberTypeService.getList();
        this.subscription.push(this.memberTypeService.list
            .subscribe(x => {
                this.level1 = x.filter(x =>x.level == 1)[0];
                this.level2 = x.filter(x =>x.level == 2)[0];
                this.level3 = x.filter(x =>x.level == 3)[0];
                this.level4 = x.filter(x =>x.level == 4)[0];
                this.level5 = x.filter(x =>x.level == 5)[0];
                this.minPrice = +this.level5.price;
                this.model.duesAmount = this.minPrice;
            })
        );
    }

    onSwitch() {
        this.onlineEntry = (!this.onlineEntry);
        this.resetForm();
    }

    submitPayment(isValid:boolean) {
        if(!isValid) {
            return;
        }
        if (this.onlineEntry) {
            // this.openPayPalsubmit();
        } else {
            // this.membershipDuesService.postCashEntry(this.model, this.member, this.setup, this.transactionCodes);
            this.snackBar.open('Posted to Cash Entry','', {
                duration: 2000,
            });
        }
        this.ngOnInit();
    }

    // openPayPalsubmit() {
    //     const modalRef = this.dialog.open(PayPalSubmit);
    //     modalRef.componentInstance.title  = "Complete your purchase"
    //     modalRef.componentInstance.message = "By clicking the PayPal button, you will be redirected to a secure popup window that allow you to make your payment. PayPal offers the option to make payments as a PayPal member, or you may choose to pay with a Debit or Credit Card through a guest account ";
    //     modalRef.componentInstance.isValid = true;
    //     modalRef.componentInstance.setup = this.setup;
    //     modalRef.componentInstance.member = this.member;
    //     modalRef.componentInstance.model = this.model;
    //     modalRef.componentInstance.transactionCodes = this.transactionCodes;
    //     modalRef.componentInstance.onClose = (x => {
    //         modalRef.close();
    //         this.resetForm();
    //     }) 
    // }
}
