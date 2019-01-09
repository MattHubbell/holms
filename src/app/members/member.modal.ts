import { Component, Input, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Member } from './member.model';
import { MemberService } from './member.service';
import { ConfirmResponses } from '../shared/modal/confirm-btn-default';
import { Salutations, Countries } from '../shared';
import { MemberType, MemberTypeService} from '../admin/member-types';
import { MemberStatus, MemberStatusService } from '../admin/member-status';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';
import * as f from '../shared/functions';

@Component({
    selector: 'member-modal-content',
    templateUrl: './member.modal.html',
    styleUrls: [ './member.modal.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class MemberModalContent implements OnInit, OnDestroy {

    @Input() selectedItem: Observable<Member>;
    @Input() model: Member;
    submitted: boolean;
    salutations = Salutations;
	countries = Countries;
    memberTypes: MemberType[];
    memberStatuses: MemberStatus[];
    subscription: Array<Subscription>;
    selectedTabIndex: number;

    constructor(
        private memberService: MemberService,
        private memberTypeService: MemberTypeService,
        private memberStatusService: MemberStatusService,
        public snackBar: MatSnackBar, 
        public dialogRef: MatDialogRef<MemberModalContent>
    ) {
        this.subscription = new Array<Subscription>();
        this.memberTypeService.getList();
        this.subscription.push(this.memberTypeService.list
            .subscribe(x => {
                this.memberTypes = x;
            })
        );
        this.memberStatusService.getList();
        this.subscription.push(this.memberStatusService.list
            .subscribe(x => {
                this.memberStatuses = x;
            })
        );
    }

    ngOnInit() {
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe);
    }

    onSubmit(isValid:boolean) {
        if (!isValid) return;
        this.memberService.updateItem(this.selectedItem, this.model);
        this.snackBar.open("Member updated","", {
            duration: 2000,
        });          
        this.dialogRef.close();
    }

    onDelete($event:ConfirmResponses) {
        if ($event === ConfirmResponses.yes) {
            this.memberService.deleteItem(this.selectedItem);
            this.snackBar.open("Member updated","", {
                duration: 2000,
            });          
            this.dialogRef.close();
        }
    }

    onClose($event:any) {
        this.dialogRef.close();
    }

    toUppercase(value, model, field) {
        f.toUppercase(value, model, field);
    }
    
    toFormatPhone(value, model, field) {
        f.toFormatPhone(value, model, field);
    }
        
}
