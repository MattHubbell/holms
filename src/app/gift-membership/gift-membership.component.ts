import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';

import { PayPalSubmit } from './paypal.component';
import { Setup, SetupService } from '../admin/setup';
import { GiftMembership } from './gift-membership.model';
import { GiftMembershipService } from './gift-membership.service';
import { Member, MemberService } from '../members';
import { MemberType, MemberTypeService } from '../admin/member-types';
import { MembershipUserType } from '../admin/membership-users';
import { TransactionCode } from '../admin/transaction-codes';
import { TransactionCodeService } from '../admin/transaction-codes';
import { TitleService } from '../title.service';
import { AppService } from '../app.service';
import { Countries } from './../shared';
import * as f from '../shared/functions';

@Component( {
    selector: 'gift-memberships',
    templateUrl: './gift-membership.component.html',
    styleUrls: [ './gift-membership.component.css' ],
    encapsulation: ViewEncapsulation.None
})

export class GiftMembershipComponent implements OnInit, OnDestroy {

    countries = Countries;
    filteredGiftMemberships: GiftMembership[];
    filteredMembers: Observable<Member[]>;
    gift: MemberType;
    giftMembership: GiftMembership;
    giftMemberships: GiftMembership[];
    isNewItem: Boolean;
    member: Member;
    members: Member[];
    minPrice: number;
    model: GiftMembership;
    onlineEntry: boolean;
    selectedItem: any;
    setup: Setup;
    setupSubscription: Array<Subscription>;
    subscription: Array<Subscription>;
    submitButtonText: string;
    superUser: boolean;
    transactionCodes: TransactionCode[];

    constructor(
        private setupService: SetupService,
        private giftMembershipService: GiftMembershipService,
        private memberService: MemberService,
        private memberTypeService: MemberTypeService,
        private transactionCodeService: TransactionCodeService,
        private titleService: TitleService,
        private appService: AppService,
        private dialog: MatDialog, 
        public snackBar: MatSnackBar

    ) {
        this.setupSubscription = new Array<Subscription>();
        this.setupService.getItem();
        this.setupSubscription.push(this.setupService.item.subscribe(x => {
            this.setup = x;
        }));
        this.titleService.selector = 'gift-membership';
    }

    ngOnInit() {
        this.subscription = new Array<Subscription>();
        this.onlineEntry = true;
        if (this.appService.membershipUser) {
            this.superUser = ((this.appService.membershipUser.userType == MembershipUserType.Administrator) ? true : false);
            this.onlineEntry = ((this.superUser) ? false : true);
        }
        this.resetForm();
    }

    ngOnDestroy() {
        this.setupSubscription.forEach(x => x.unsubscribe());
        this.subscription.forEach(x => x.unsubscribe());
        this.subscription = new Array<Subscription>();
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
        this.filterGiftMemberships();
    }

    filterGiftMemberships() {
        if (!this.giftMemberships) {
            return;
        }
        this.filteredGiftMemberships = new GiftMembership()[0];
        if (this.model.donorMemberNo) {
            if (this.model.donorMemberNo.length > 0) {
                this.filteredGiftMemberships = this.giftMemberships.filter(xx => xx.donorMemberNo == this.model.donorMemberNo);
            }
        }
    }

    displayAnnualNameFn(giftMembership?: string): string | undefined {
        return giftMembership ? giftMembership : undefined;
    }

    onAnnualNameChange(memberName:any) {
        if (!this.filteredGiftMemberships) {
            return;
        }
        this.isNewItem = false; 
        let giftMembership:GiftMembership = this.filteredGiftMemberships.find(x => x.annualName.toLowerCase().indexOf(memberName.toLowerCase()) === 0);
        if (giftMembership) {
            this.isNewItem = false;
            this.giftMembership = GiftMembership.clone(giftMembership);
            this.model.recipientName = this.giftMembership.recipientName;
            this.model.street1 = this.giftMembership.street1;
            this.model.street2 = this.giftMembership.street2;
            this.model.city = this.giftMembership.city;
            this.model.state = this.giftMembership.state;
            this.model.country = this.giftMembership.country;
            this.model.zip = this.giftMembership.zip;
            this.model.eMailAddr = this.giftMembership.eMailAddr;
        }
    }

    resetForm() {
        this.model = new GiftMembership;
        this.isNewItem = true;
        if (this.onlineEntry) {
            this.model.donorMemberNo = this.appService.membershipUser.memberId;
            this.submitButtonText = 'Purchase';
        } else {
            this.submitButtonText = "Post to Cash Entry";
        }
        this.giftMembershipService.getList();
        this.subscription.push(this.giftMembershipService.list
            .subscribe(x => {
                this.giftMemberships = x;
                this.filterGiftMemberships();
            })
        );
        this.memberService.getList();
        this.subscription.push(this.memberService.list
            .subscribe(x => {
                this.members = x;
            })
        );
        this.member = new Member();
        this.subscription.push(this.memberService.getItemByMemberID(((this.model.donorMemberNo) ? this.model.donorMemberNo : ''))
            .subscribe(x => {
                if (this.model.donorMemberNo) {
                    if (this.model.donorMemberNo.length > 0) {
                        this.member = x[0];
                    }
                }
            })
        );
        this.memberTypeService.getList();
        this.subscription.push(this.memberTypeService.list
            .subscribe(x => {
                this.model.memberTypes = x.sort(this.compareNumbersDescending);
                this.gift = x.filter(x => x.level == 10)[0];
                this.minPrice = +this.gift.price;
                this.model.duesAmount = this.minPrice;
            })
        );
        this.transactionCodeService.getList();
        this.subscription.push(this.transactionCodeService.list
            .subscribe(x => {
                this.transactionCodes = x;
            })
        );
    }

    compareNumbersDescending(a:MemberType,b:MemberType) {
        return +b.price - +a.price;
    }

    onSwitch() {
        this.onlineEntry = (!this.onlineEntry);
        this.resetForm();
    }

    toggleMerchandise() {
        if (this.model.isMerchandiseChecked) {
            this.model.merchandisePackageAmount = 20;
            if (this.model.country.toUpperCase() == 'UNITED STATES') {
                this.model.shippingCharges = 15;
            } else {
                this.model.shippingCharges = 50;
            }
        } else {
            this.model.merchandisePackageAmount = 0;
            this.model.shippingCharges = 0;
        }
    }

    submitPayment(form: NgForm) {
        if(!form.valid) {
            return;
        }
        this.model.comments = "Gift Membership to " + f.camelCase(this.model.recipientName);
        if (this.isNewItem) {
            this.giftMembershipService.addItem(this.model);
        } else {
            this.giftMembershipService.updateItem(this.giftMembership, this.model);
        }
        if (this.onlineEntry) {
            this.openPayPalsubmit();
        } else {
            this.giftMembershipService.postCashEntry(this.model, this.member, this.setup, this.transactionCodes);
            this.snackBar.open('Posted to Cash Entry','', {
                duration: 2000,
            });
        }
        form.resetForm(this.model);
        this.ngOnInit();
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
}
