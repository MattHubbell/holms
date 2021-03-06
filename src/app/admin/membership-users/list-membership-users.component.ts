import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatDialogRef, MatSort } from '@angular/material';
import { Subscription } from 'rxjs';

import { TitleService } from '../../title.service';
import { MembershipUser, MembershipUserType } from './membership-user.model';
import { MembershipUserService } from './membership-user.service';
import { MembershipUserModalContent } from './membership-user.modal';

@Component({
    templateUrl: './list-membership-users.component.html',
    styleUrls: [ './list-membership-users.component.css' ]
})

export class ListMembershipUserComponent implements OnInit, OnDestroy{

    subscription: Subscription;
    dataSource: MatTableDataSource<MembershipUser> = new MatTableDataSource<MembershipUser>();
    displayedColumns = ['key', 'name', 'memberId', 'userType'];
    dialogConfig: MatDialogConfig;
    modalRef: MatDialogRef<any,any>;
    membershipUserType:typeof MembershipUserType = MembershipUserType;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    constructor(
        private membershipUserService: MembershipUserService, 
        private titleService: TitleService,
        private modalService: MatDialog
    ) {
        this.titleService.selector = 'list-membership-users';
    }

    ngOnInit() {
        this.membershipUserService.getList();
        this.subscription = this.membershipUserService.list.subscribe(list => {
            this.dataSource = new MatTableDataSource<MembershipUser>(list);
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
        });
        this.dialogConfig = new MatDialogConfig();
        this.dialogConfig.disableClose = true;
        this.dialogConfig.autoFocus = true;
    }
    
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
    
    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toUpperCase(); // Datasource defaults to lowercase matches
        this.dataSource.filter = filterValue;
    }

    addNew() {
        this.modalRef = this.modalService.open(MembershipUserModalContent, this.dialogConfig);
        this.modalRef.componentInstance.isNewItem = true;
        this.modalRef.componentInstance.model = new MembershipUser();
    }

    edit(object:any) {        
        this.modalRef = this.modalService.open(MembershipUserModalContent, this.dialogConfig);
        this.modalRef.componentInstance.isNewItem = false;
        this.modalRef.componentInstance.selectedItem = object;
        this.modalRef.componentInstance.model = MembershipUser.clone(object);
   }
}
