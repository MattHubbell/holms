
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { ConfirmResponses } from '../../shared/modal/confirm-btn-default';
import { Observable } from 'rxjs';

import { MemberStatus } from './member-status.model';
import { MemberStatusService } from './member-status.service';

@Component({
    selector: 'member-status-modal-content',
    templateUrl: './member-status.modal.html',
    styleUrls: [ './member-status.modal.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class MemberStatusModalContent implements OnInit {

    @Input() selectedItem: Observable<MemberStatus>;
    @Input() model: MemberStatus;
    @Input() isNewItem: Boolean;

    tableName: string;

    constructor(
        private memberStatusService: MemberStatusService, 
        public snackBar: MatSnackBar, 
        public dialogRef: MatDialogRef<MemberStatus>
    ) {
    }

    ngOnInit() {
        this.tableName = MemberStatus.TableName();
    }

    onSubmit(isValid:boolean) {
        if(!isValid) {
            return;
        }
        if (this.isNewItem) {
            this.memberStatusService.addItem(this.model);
            this.snackBar.open("Member Status added","", {
                duration: 2000,
            });          
        } else {
            this.memberStatusService.updateItem(this.selectedItem, this.model);
            this.snackBar.open("Member Status updated","", {
                duration: 2000,
            });          
        }
        this.dialogRef.close();
    }

    onDelete($event:ConfirmResponses) {
        if ($event === ConfirmResponses.yes) {
            this.memberStatusService.deleteItem(this.selectedItem);
            this.dialogRef.close();
            this.snackBar.open("Member Status deleted","", {
                duration: 2000,
            });          
        }
    }

    onClose($event:any) {
        this.dialogRef.close();
    }
}
