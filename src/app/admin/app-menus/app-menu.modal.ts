import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ConfirmResponses } from '../../shared/modal/confirm-btn-default';
import { Observable } from 'rxjs';

import { AppMenu } from './app-menu.model';
import { AppMenuService } from './app-menu.service';
import { MembershipUserType } from '../membership-users';

@Component({
    selector: 'app-menu-modal-content',
    templateUrl: './app-menu.modal.html',
    styleUrls: [ './app-menu.modal.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class AppMenuModalContent implements OnInit {

    @Input() selectedItem: Observable<AppMenu>;
    @Input() model: AppMenu;
    @Input() isNewItem: Boolean;

    membershipUserTypes: typeof MembershipUserType = MembershipUserType;
    tableName: string;

    constructor(
        private appMenuService: AppMenuService, 
        public dialogRef: MatDialogRef<AppMenu>
    ) {
    }

    ngOnInit() {
        this.tableName = AppMenu.TableName();
    }

    onSubmit(isValid:boolean) {
        if(!isValid) {
            return;
        }
        if (this.isNewItem) {
            this.appMenuService.addItem(this.model);
        } else {
            this.appMenuService.updateItem(this.selectedItem, this.model);
        }
        this.dialogRef.close();
    }

    onDelete($event:ConfirmResponses) {
        if ($event === ConfirmResponses.yes) {
            this.appMenuService.deleteItem(this.selectedItem);
            this.dialogRef.close();
        }
    }

    onClose($event:any) {
        this.dialogRef.close();
    }
}
