import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MembershipUser, MembershipUserType } from './membership-user.model';
import { MembershipUserService } from './membership-user.service';
import { ConfirmResponses } from '../../shared/modal/confirm-btn-default';
import { Observable } from 'rxjs';

@Component({
    selector: 'membership-user-modal-content',
    templateUrl: './membership-user.modal.html',
    styleUrls: [ './membership-user.modal.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class MembershipUserModalContent implements OnInit {

    @Input() selectedItem: Observable<MembershipUser>;
    @Input() model: MembershipUser;
    @Input() isNewItem: Boolean;

    membershipUserType:typeof MembershipUserType = MembershipUserType;
    tableName: string;

    constructor(
        private membershipUserService: MembershipUserService, 
        public dialogRef: MatDialogRef<MembershipUser>
    ) {
    }

    ngOnInit() {
        this.tableName = MembershipUser.TableName();
    }

    onSubmit(isValid:boolean) {
        if(!isValid) {
            return;
        }
        if (this.isNewItem) {
            this.membershipUserService.addItem(this.model['key'], this.model);
        } else {
            this.membershipUserService.updateItem(this.selectedItem, this.model);
        }
        this.dialogRef.close();
    }

    onDelete($event:ConfirmResponses) {
        if ($event === ConfirmResponses.yes) {
            this.membershipUserService.deleteItem(this.selectedItem);
            this.dialogRef.close();
        }
    }

    onClose($event:any) {
        this.dialogRef.close();
    }
}
