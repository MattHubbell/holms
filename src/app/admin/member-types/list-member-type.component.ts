import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { Subscription } from 'rxjs';

import { MemberType } from './member-type.model';
import { MemberTypeService } from './member-type.service';
import { MemberTypeModalContent } from './member-type.modal';
import { TitleService } from '../../title.service';

@Component({
    templateUrl: './list-member-type.component.html',
    styleUrls: [ './list-member-type.component.css' ]
})

export class ListMemberTypeComponent implements OnInit, OnDestroy{

    subscription: Subscription;
    dataSource: MatTableDataSource<MemberType> = new MatTableDataSource<MemberType>();
    displayedColumns = ['id', 'description', 'level', 'price'];
    dialogConfig: MatDialogConfig;
    modalRef: MatDialogRef<any,any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private memberTypeService: MemberTypeService, 
        private titleService: TitleService,
        private modalService: MatDialog
    ) {
        this.titleService.selector = 'list-member-type';
    }

    ngOnInit() {
        this.memberTypeService.getList();
        this.subscription = this.memberTypeService.list.subscribe(list => {
            this.dataSource = new MatTableDataSource<MemberType>(list);
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
        this.modalRef = this.modalService.open(MemberTypeModalContent, this.dialogConfig);
        this.modalRef.componentInstance.isNewItem = true;
        this.modalRef.componentInstance.model = new MemberType();
    }

    edit(object:any) {        
        this.modalRef = this.modalService.open(MemberTypeModalContent, this.dialogConfig);
        this.modalRef.componentInstance.isNewItem = false;
        this.modalRef.componentInstance.selectedItem = object;
        this.modalRef.componentInstance.model = MemberType.clone(object);
   }
}
