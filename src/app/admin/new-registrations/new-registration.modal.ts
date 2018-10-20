import { Component, Input, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MatPaginator } from '@angular/material';
import { ConfirmResponses } from '../../shared/modal/confirm-btn-default';
import { Observable, Subscription } from 'rxjs';
import * as f from '../../shared/functions';

import { NewRegistration } from './new-registration.model';
import { NewMemberService } from './new-registration.service';
import { Member,MemberFilterOptions, MemberService } from '../../members';
import { Salutations, Countries } from '../../shared';
import { Setup, SetupService } from "../setup";
import { MembershipUser, MembershipUserService, MembershipUserType } from "../membership-users";
import { EmailService } from '../../shared/email.service';
import { MatSnackBar } from '@angular/material';
import { JQueryService } from '../../shared/jquery.service';

@Component({
    selector: 'new-member-modal-content',
    templateUrl: './new-registration.modal.html',
    styleUrls: [ './new-registration.modal.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class NewMemberModalContent implements OnInit, OnDestroy {

    @Input() selectedItem: Observable<NewRegistration>;
    @Input() model: NewRegistration;
    @Input() isNewItem: Boolean;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    key:string;
    tableName: string;
    salutations = Salutations;
    countries = Countries;
    members: Member[];
    selectedTabIndex: number;
    searchText: string;
    selectedMember: Observable<Member>;
    setup: Setup;
    selectedMembership: Observable<MembershipUser>;
    membershipUser: MembershipUser;  
    filterOptions = MemberFilterOptions;
    filterBy: number;
    dataSource = new MatTableDataSource<Member>(this.members);
    displayedColumns = ['memberNo', 'memberName', 'addrLine1', 'addrLine2', 'city', 'state', 'zip', 'meBook'];
    subscription = new Array<Subscription>();

    constructor(
        private newMemberService: NewMemberService,
        private memberService: MemberService, 
        private emailService: EmailService,
        private setupService: SetupService,
        private membershipUserService: MembershipUserService,
        private jQueryService:JQueryService,
        public dialogRef: MatDialogRef<NewRegistration>,
        public snackBar: MatSnackBar
    ) {
    }

    ngOnInit() {
        this.key = this.selectedItem['key'];
        this.tableName = NewRegistration.TableName();
        this.selectedTabIndex = 0;
        this.subscribeData();    
        this.searchText = this.getFilterValue(this.model.registrationName);
    }

    ngOnDestroy() {
        this.subscription.forEach(x => {
            x.unsubscribe();
        });
        this.subscription = Array<Subscription>();
    }

    onSubmit(isValid:boolean) {
        if(!isValid) {
            return;
        }
        if (this.model.memberNo == '') {
            this.newMemberService.updateItem(this.selectedItem, this.model);
        } else {
            let member:Member = this.members.find(x => x.memberNo == this.model.memberNo);
            if (member) {
                this.selectedMember = this.memberService.getItemByKey(member['key']);
                this.updateMember(this.model, member);
            } else {
                this.addMember(this.model);
            }
            let message:string = this.sendAckowledgmentEmail();
            this.snackBar.open(message,'', {
                duration: 2000,
            });
            this.membershipUser.memberId = this.model.memberNo;
            this.membershipUser.userType = MembershipUserType.Member;
            this.membershipUserService.updateObject(this.selectedMembership, this.key ,this.membershipUser);
            this.newMemberService.deleteItem(this.selectedItem);
        }
        this.snackBar.open('New member updated','', {
            duration: 2000,
        });
        this.dialogRef.close();
    }

    onDelete($event:ConfirmResponses) {
        if ($event === ConfirmResponses.yes) {
            this.newMemberService.deleteItem(this.selectedItem);
            this.dialogRef.close();
        }
    }

    onClose($event:any) {
        this.dialogRef.close();
    }

    subscribeData() {
        this.memberService.getList();
        this.subscription.push(this.memberService.list
            .subscribe(x => {
                this.members = x;
                this.dataSource = new MatTableDataSource<Member>(this.members);
                this.dataSource.paginator = this.paginator;
                this.dataSource.filter = this.getFilterValue(this.model.registrationName);
            })
        );
        this.setupService.getItem();
        this.subscription.push(this.setupService.item
            .subscribe(x => {
                if (x) {
                    this.setup = x;
                }
            })
        );
        this.subscription.push(this.membershipUserService.getItemByKey(this.key).subscribe(x => {
            this.selectedMembership = x;
            this.membershipUser = this.jQueryService.cloneObject(this.selectedMembership);
        }));
    }

    getFilterValue(value: string): string {
        return value.split(' ')[0];
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toUpperCase(); // Datasource defaults to lowercase matches
        this.searchText = filterValue;
        this.dataSource.filter = filterValue;
    }

    onAssignMemberNo() {
        this.model.memberNo = this.setup.nextMemberNo.toString();
        this.setup.nextMemberNo += 1;
        this.setupService.updateItem(this.setup);
    }

    onRowClick(member:Member) {
        this.model.memberNo = member.memberNo;
        this.model.arBook = member.arBook;
        this.model.hgBook = member.hgBook;
        this.model.meBook = member.meBook;
        this.model.memberStatus = member.memberStatus;
        this.model.memberType = member.memberType;
        this.model.lastDuesYear = member.lastDuesYear;
        this.model.sortName = member.sortName;
        this.selectedTabIndex = 1;
    }

    onFilterChange() {
        switch(this.filterBy) {
            case MemberFilterOptions.Everything:
                this.dataSource = new MatTableDataSource<Member>(this.members);
                this.dataSource.paginator = this.paginator;
                this.dataSource.filter = this.getFilterValue(this.model.registrationName);
                break;
            case MemberFilterOptions.Member_No:
                this.dataSource.filterPredicate =
                    (data: NewRegistration, filter: string) => data.memberNo.startsWith(this.searchText);
                break;
            case MemberFilterOptions.ME_Book:
                this.dataSource.filterPredicate =
                (data: NewRegistration, filter: string) => data.meBook.startsWith(this.searchText);
                break;
            case MemberFilterOptions.City:
                this.dataSource.filterPredicate =
                (data: NewRegistration, filter: string) => data.city.startsWith(this.searchText);
                break;
            case MemberFilterOptions.Zip:
                this.dataSource.filterPredicate =
                (data: NewRegistration, filter: string) => data.zip.startsWith(this.searchText);
                break;
        }
    }

    addMember(newMember: NewRegistration) {
        let member: Member = new Member();
        member.memberNo = newMember.memberNo;
        member.oldMemberNo = 0;
        member.salutation = newMember.salutation;
        member.memberName = newMember.registrationName;
        member.addrLine1 = newMember.street1;
        member.addrLine2 = newMember.street2;
        member.city = newMember.city;
        member.state = newMember.state;
        member.zip = newMember.zip;
        member.country = newMember.country;
        member.phone = newMember.phone;
        member.hgBook = newMember.hgBook;
        member.arBook = newMember.arBook;
        member.meBook = newMember.meBook;
        member.annualName = newMember.annualName;
        member.sortName = newMember.sortName;
        member.lastDuesYear = newMember.lastDuesYear;
        member.startYear = +(new Date().getFullYear);
        member.memberType = newMember.memberType;
        member.memberStatus = newMember.memberStatus;
        member.eMailAddr = newMember.email;
        member.fax = '';
        member.comments = '';
        member.isAlternateAddress = false;
        member.giftFromMember = '';
        member.printCertification = false;
        member.certificationDate = '';
        this.memberService.addItem(member);
    } 
    
    updateMember(newMember: NewRegistration, member: Member) {
        member.memberNo = newMember.memberNo;
        member.salutation = newMember.salutation;
        member.memberName = newMember.registrationName;
        member.addrLine1 = newMember.street1;
        member.addrLine2 = newMember.street2;
        member.city = newMember.city;
        member.state = newMember.state;
        member.zip = newMember.zip;
        member.country = newMember.country;
        member.phone = newMember.phone;
        member.hgBook = newMember.hgBook;
        member.arBook = newMember.arBook;
        member.meBook = newMember.meBook;
        member.annualName = newMember.annualName;
        member.sortName = newMember.sortName;
        member.lastDuesYear = newMember.lastDuesYear;
        member.memberType = newMember.memberType;
        member.memberStatus = newMember.memberStatus;
        member.eMailAddr = newMember.email;
        this.memberService.updateObject(this.selectedMember, member['key'], member);
    }
    
    sendAckowledgmentEmail(): string {
        let emailMsg:string = '';
        this.emailService.sendMail(this.model.email, this.setup.holmsEmail,  this.setup.appSubTitle + ' - Welcome Member!'
            , f.camelCase(this.model.registrationName) + ',\r\n\r\n' + this.setup.regEmailMessage)
            .subscribe(
            message  => {
                emailMsg = message;
            },
            error =>  {
                emailMsg = error;
        });
        if (emailMsg.length>0) {
            emailMsg = "E-mail sent!"
        }
        return emailMsg;
    }
}
