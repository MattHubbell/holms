import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { JQueryService } from '../shared/jquery.service';
import { Subscription } from 'rxjs';

import { TitleService } from '../title.service';
import { Member, MemberFilterOptions } from './member.model';
import { MemberService } from './member.service';
import { MemberModalContent } from './member.modal';

@Component({
    templateUrl: './list-members.component.html',
    styleUrls: [ './list-members.component.css' ]
})

export class ListMemberComponent implements OnInit, OnDestroy {

    members: Member[];
    searchText: string = '';
    filterOptions = MemberFilterOptions;
    filterBy: number = 0;
    dataSource = new MatTableDataSource<Member>(this.members);
    displayedColumns = ['memberNo', 'memberName', 'addrLine1', 'addrLine2', 'city', 'state', 'zip', 'meBook'];
    modalRef: any;

    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;

    subscription: Array<Subscription>;

    constructor(
        private memberService: MemberService, 
        private titleService: TitleService,
        private jQueryService: JQueryService,
        private modalService: MatDialog
    ) {
        this.titleService.selector = 'list-members';
        this.subscription = new Array<Subscription>();
    }

    ngOnInit() {
        this.memberService.getList();
        this.subscription.push(this.memberService.list
            .subscribe(x => {
                this.members = x;
                this.onFilterChange();
            })
        );
        this.titleService.selector = 'list-members';
        this.filterBy = MemberFilterOptions.Everything;
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe);
    }

    applyFilter(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toUpperCase(); // Datasource defaults to lowercase matches
        this.searchText = filterValue;
        this.dataSource.filter = filterValue;
    }

    onFilterChange() {
        this.dataSource = new MatTableDataSource<Member>(this.members);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        switch(this.filterBy) {
            case MemberFilterOptions.Member_No:
                this.dataSource.filterPredicate =
                (data: Member, filter: string) => data.memberNo.startsWith(this.searchText);
                break;
            case MemberFilterOptions.ME_Book:
                this.dataSource.filterPredicate =
                (data: Member, filter: string) => data.meBook.startsWith(this.searchText);
                break;
            case MemberFilterOptions.City:
                this.dataSource.filterPredicate =
                (data: Member, filter: string) => data.city.startsWith(this.searchText);
                break;
            case MemberFilterOptions.Zip:
                this.dataSource.filterPredicate =
                (data: Member, filter: string) => data.zip.startsWith(this.searchText);
                break;
        }
        this.applyFilter(this.searchText);
    }

    addNew() {
        const dialogConfig = new MatDialogConfig();
        this.modalRef = this.modalService.open(MemberModalContent, dialogConfig);
        this.modalRef.componentInstance.isNewItem = true;
        this.modalRef.componentInstance.model = new Member();
    }

    edit(member:any) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.autoFocus = true;
        this.modalRef = this.modalService.open(MemberModalContent, dialogConfig);
        this.modalRef.componentInstance.selectedItem = member;
        this.modalRef.componentInstance.model = this.jQueryService.cloneObject(member);
    }

}
