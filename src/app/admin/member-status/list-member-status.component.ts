import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { TitleService } from '../../title.service';
import { MemberStatus } from './member-status.model';
import { MemberStatusService } from './member-status.service';
import { MemberStatusModalContent } from './member-status.modal';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { JQueryService } from '../../shared/jquery.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './list-member-status.component.html',
    styleUrls: [ './list-member-status.component.css' ]
})

export class ListMemberStatusComponent implements OnInit, OnDestroy{

    subscription: Subscription;
    dataSource: MatTableDataSource<MemberStatus> = new MatTableDataSource<MemberStatus>();
    displayedColumns = ['id', 'description'];
    dialogConfig: MatDialogConfig;
    modalRef: MatDialogRef<any,any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private memberStatusService: MemberStatusService, 
        private titleService: TitleService,
        private jQueryService:JQueryService,
        private modalService: MatDialog
    ) {
        this.titleService.selector = 'list-member-status';
    }

    ngOnInit() {
        this.memberStatusService.getList();
        this.subscription = this.memberStatusService.list.subscribe(list => {
            this.dataSource = new MatTableDataSource<MemberStatus>(list);
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
        this.modalRef = this.modalService.open(MemberStatusModalContent, this.dialogConfig);
        this.modalRef.componentInstance.isNewItem = true;
        this.modalRef.componentInstance.model = new MemberStatus();
    }

    edit(object:any) {        
        this.modalRef = this.modalService.open(MemberStatusModalContent, this.dialogConfig);
        this.modalRef.componentInstance.isNewItem = false;
        this.modalRef.componentInstance.selectedItem = object;
        this.modalRef.componentInstance.model = this.jQueryService.cloneObject(object);
   }
}
