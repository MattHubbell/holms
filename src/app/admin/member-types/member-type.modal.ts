
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { MatDialogRef } from '@angular/material';
import { ConfirmResponses } from '../../shared/modal/confirm-btn-default';
import { Observable } from 'rxjs';

import { MemberType } from './member-type.model';
import { MemberTypeService } from './member-type.service';

@Component({
    selector: 'member-type-modal-content',
    templateUrl: './member-type.modal.html',
    styleUrls: [ './member-type.modal.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class MemberTypeModalContent implements OnInit {

    @Input() selectedItem: Observable<MemberType>;
    @Input() model: MemberType;
    @Input() isNewItem: Boolean;

    tableName: string;

    constructor(
        private memberTypeService: MemberTypeService, 
        public snackBar: MatSnackBar, 
        public dialogRef: MatDialogRef<MemberType>
    ) {
    }

    ngOnInit() {
        this.tableName = MemberType.TableName();
    }

    onSubmit(isValid:boolean) {
        if(!isValid) {
            return;
        }
        if (this.isNewItem) {
            this.memberTypeService.addItem(this.model);
            this.snackBar.open("Member Type added","", {
                duration: 2000,
            });          
        } else {
            this.memberTypeService.updateItem(this.selectedItem, this.model);
            this.snackBar.open("Member Type updated","", {
                duration: 2000,
            });          
        }
        this.dialogRef.close();
    }

    onDelete($event:ConfirmResponses) {
        if ($event === ConfirmResponses.yes) {
            this.memberTypeService.deleteItem(this.selectedItem);
            this.snackBar.open("Member Type deleted","", {
                duration: 2000,
            });          
            this.dialogRef.close();
        }
    }

    onClose($event:any) {
        this.dialogRef.close();
    }
}
