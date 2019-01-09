import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { TitleService } from '../../title.service';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { JQueryService } from '../../shared/jquery.service';
import { Subscription } from 'rxjs';

import { NewRegistration } from './new-registration.model';
import { NewRegistrationService } from './new-registration.service';
import { NewRegistrationModalContent } from './new-registration.modal';

@Component({
    templateUrl: './list-new-registrations.component.html',
    styleUrls: [ './list-new-registrations.component.css' ]
})

export class ListNewRegistrationComponent implements OnInit, OnDestroy{

    subscription: Subscription;
    dataSource: MatTableDataSource<NewRegistration> = new MatTableDataSource<NewRegistration>();
    displayedColumns = ['registrationName', 'street1', 'street2', 'city', 'state', 'zip'];
    dialogConfig: MatDialogConfig;
    modalRef: MatDialogRef<any,any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private newRegistrationService: NewRegistrationService, 
        private titleService: TitleService,
        private jQueryService:JQueryService,
        private modalService: MatDialog
    ) {
        this.titleService.selector = 'list-new-registrations';
    }

    ngOnInit() {
        this.newRegistrationService.getList();
        this.subscription = this.newRegistrationService.list.subscribe(list => {
            this.dataSource = new MatTableDataSource<NewRegistration>(list);
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
        this.modalRef = this.modalService.open(NewRegistrationModalContent, this.dialogConfig);
        this.modalRef.componentInstance.isNewItem = true;
        this.modalRef.componentInstance.model = new NewRegistration();
    }

    edit(object:any) {        
        this.modalRef = this.modalService.open(NewRegistrationModalContent, this.dialogConfig);
        this.modalRef.componentInstance.isNewItem = false;
        this.modalRef.componentInstance.selectedItem = object;
        this.modalRef.componentInstance.model = this.jQueryService.cloneObject(object);
   }
}
