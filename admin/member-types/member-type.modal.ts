
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { MemberType } from './member-type.model';
import { MemberTypeService } from './member-type.service';
import { ConfirmResponses } from '../../shared/modal/confirm-btn-default';
import { Observable } from 'rxjs';

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
        } else {
            this.memberTypeService.updateItem(this.selectedItem, this.model);
        }
        this.dialogRef.close();
    }

    onDelete($event:ConfirmResponses) {
        if ($event === ConfirmResponses.yes) {
            this.memberTypeService.deleteItem(this.selectedItem);
            this.dialogRef.close();
        }
    }

    onClose($event:any) {
        this.dialogRef.close();
    }
}
