
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MemberStatus } from './member-status.model';
import { MemberStatusService } from './member-status.service';
import { ConfirmResponses } from '../../shared/modal/confirm-btn-default';
import { Observable } from 'rxjs';

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
        } else {
            this.memberStatusService.updateItem(this.selectedItem, this.model);
        }
        this.dialogRef.close();
    }

    onDelete($event:ConfirmResponses) {
        if ($event === ConfirmResponses.yes) {
            this.memberStatusService.deleteItem(this.selectedItem);
            this.dialogRef.close();
        }
    }

    onClose($event:any) {
        this.dialogRef.close();
    }
}
