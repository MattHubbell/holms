import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { TitleService } from '../../title.service';
import { MatPaginator, MatTableDataSource, MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';
import { JQueryService } from '../../shared/jquery.service';
import { Subscription } from 'rxjs';

import { AppMenu } from './app-menu.model';
import { AppMenuService } from './app-menu.service';
import { AppMenuModalContent } from './app-menu.modal';

@Component({
    templateUrl: './list-app-menu.component.html',
    styleUrls: [ './list-app-menu.component.css' ]
})

export class ListAppMenuComponent implements OnInit, OnDestroy {

    subscription: Subscription;
    dataSource: MatTableDataSource<AppMenu> = new MatTableDataSource<AppMenu>();
    displayedColumns = ['menuId', 'title', 'selector', 'routerLink'];
    dialogConfig: MatDialogConfig;
    modalRef: MatDialogRef<any,any>;

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private formBuilder: FormBuilder, 
        private appMenuService: AppMenuService, 
        private titleService: TitleService,
        private jQueryService:JQueryService,
        private modalService: MatDialog
    ) {
        this.titleService.selector = 'list-app-menu';
    }

    ngOnInit() {
        this.appMenuService.getList();
        this.subscription = this.appMenuService.list.subscribe(list => {
          this.dataSource = new MatTableDataSource<AppMenu>(list);
          this.dataSource.paginator = this.paginator;
          });
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
        this.modalRef = this.modalService.open(AppMenuModalContent, this.dialogConfig);
        this.modalRef.componentInstance.isNewItem = true;
        this.modalRef.componentInstance.model = new AppMenu();
    }

    edit(object:any) {        
        this.modalRef = this.modalService.open(AppMenuModalContent, this.dialogConfig);
        this.modalRef.componentInstance.isNewItem = false;
        this.modalRef.componentInstance.selectedItem = object;
        this.modalRef.componentInstance.model = this.jQueryService.cloneObject(object);
   }
}