import { Component, Input, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { MatDialogRef, MatTableDataSource, MatPaginator } from '@angular/material';
import { ConfirmResponses } from '../../shared/modal/confirm-btn-default';
import { Observable, Subscription } from 'rxjs';
import * as f from '../../shared/functions';

import { NewRegistration } from './new-registration.model';
import { NewRegistrationService } from './new-registration.service';
import { Member,MemberFilterOptions, MemberService } from '../../members';
import { MemberType, MemberTypeService} from '../member-types';
import { MemberStatus, MemberStatusService } from '../member-status';
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
export class NewRegistrationModalContent implements OnInit, OnDestroy {

    @Input() selectedItem: Observable<NewRegistration>;
    @Input() model: NewRegistration;
    @Input() isNewItem: Boolean;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    key:string;
    tableName: string;
    salutations = Salutations;
    countries = Countries;
    members: Member[];
    memberTypes: MemberType[];
    memberStatuses: MemberStatus[];
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
        private newRegistrationService: NewRegistrationService,
        private memberService: MemberService, 
        private memberTypeService: MemberTypeService,
        private memberStatusService: MemberStatusService,
        private emailService: EmailService,
        private setupService: SetupService,
        private membershipUserService: MembershipUserService,
        private jQueryService:JQueryService,
        public dialogRef: MatDialogRef<NewRegistration>,
        public snackBar: MatSnackBar
    ) {
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
            this.newRegistrationService.updateItem(this.selectedItem, this.model);
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
            this.newRegistrationService.deleteItem(this.selectedItem);
        }
        this.snackBar.open('New member updated','', {
            duration: 2000,
        });
        this.dialogRef.close();
    }

    onDelete($event:ConfirmResponses) {
        if ($event === ConfirmResponses.yes) {
            this.newRegistrationService.deleteItem(this.selectedItem);
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

    addMember(newRegistration: NewRegistration) {
        let member: Member = new Member();
        member.memberNo = newRegistration.memberNo;
        member.oldMemberNo = 0;
        member.salutation = newRegistration.salutation;
        member.memberName = newRegistration.registrationName;
        member.addrLine1 = newRegistration.street1;
        member.addrLine2 = newRegistration.street2;
        member.city = newRegistration.city;
        member.state = newRegistration.state;
        member.zip = newRegistration.zip;
        member.country = newRegistration.country;
        member.phone = newRegistration.phone;
        member.hgBook = newRegistration.hgBook;
        member.arBook = newRegistration.arBook;
        member.meBook = newRegistration.meBook;
        member.annualName = newRegistration.annualName;
        member.sortName = newRegistration.sortName;
        member.lastDuesYear = newRegistration.lastDuesYear;
        member.startYear = +(new Date().getFullYear);
        member.memberType = newRegistration.memberType;
        member.memberStatus = newRegistration.memberStatus;
        member.eMailAddr = newRegistration.email;
        member.fax = '';
        member.comments = '';
        member.isAlternateAddress = false;
        member.giftFromMember = '';
        member.printCertification = false;
        member.certificationDate = '';
        this.memberService.addItem(member);
    } 
    
    updateMember(newRegistration: NewRegistration, member: Member) {
        member.memberNo = newRegistration.memberNo;
        member.salutation = newRegistration.salutation;
        member.memberName = newRegistration.registrationName;
        member.addrLine1 = newRegistration.street1;
        member.addrLine2 = newRegistration.street2;
        member.city = newRegistration.city;
        member.state = newRegistration.state;
        member.zip = newRegistration.zip;
        member.country = newRegistration.country;
        member.phone = newRegistration.phone;
        member.hgBook = newRegistration.hgBook;
        member.arBook = newRegistration.arBook;
        member.meBook = newRegistration.meBook;
        member.annualName = newRegistration.annualName;
        member.sortName = newRegistration.sortName;
        member.lastDuesYear = newRegistration.lastDuesYear;
        member.memberType = newRegistration.memberType;
        member.memberStatus = newRegistration.memberStatus;
        member.eMailAddr = newRegistration.email;
        this.memberService.updateObject(member['key'], member);
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
