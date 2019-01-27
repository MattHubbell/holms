import { Component, Input, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { ConfirmResponses } from '../shared/modal/confirm-btn-default';
import { MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { Subscription } from 'rxjs';

import { Member } from './member.model';
import { MemberService } from './member.service';
import { MemberType, MemberTypeService} from '../admin/member-types';
import { MemberStatus, MemberStatusService } from '../admin/member-status';
import { Setup, SetupService } from "../admin/setup";
import { Salutations, Countries } from '../shared';

@Component({
    selector: 'member-modal-content',
    templateUrl: './member.modal.html',
    styleUrls: [ './member.modal.css' ], 
    encapsulation: ViewEncapsulation.None
})
export class MemberModalContent implements OnInit, OnDestroy {

    @Input() selectedItem: Observable<Member>;
    @Input() model: Member;
    @Input() isNewItem: Boolean;

    isSubmitted: boolean;
    tableName: string;
    salutations = Salutations;
	countries = Countries;
    memberTypes: MemberType[];
    memberStatuses: MemberStatus[];
    setup: Setup;
    subscription: Array<Subscription>;
    selectedTabIndex: number;

    constructor(
        private memberService: MemberService,
        private memberTypeService: MemberTypeService,
        private memberStatusService: MemberStatusService,
        private setupService: SetupService,
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
        this.setupService.getItem();
        this.subscription.push(this.setupService.item
            .subscribe(x => {
                if (x) {
                    this.setup = x;
                }
            })
        );
    }

    ngOnInit() {
        this.isSubmitted = false;
        this.tableName = MemberStatus.TableName();
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe());
    }

    onAssignMemberNo() {
        this.model.memberNo = this.setup.nextMemberNo.toString();
        this.setup.nextMemberNo += 1;
        this.setupService.updateItem(this.setup);
    }

    onSubmit(isValid:boolean) {
        this.isSubmitted = true;
        if(!isValid) {
            return;
        }
        if (this.isNewItem) {
            this.memberService.addItem(this.model);
            this.snackBar.open("Member added","", {
                duration: 2000,
            });          
        } else {
            this.memberService.updateItem(this.selectedItem, this.model);
            this.snackBar.open("Member updated","", {
                duration: 2000,
            });          
        }
        this.dialogRef.close();
    }

    onDelete($event:ConfirmResponses) {
        if ($event === ConfirmResponses.yes) {
            this.memberService.deleteItem(this.selectedItem);
            this.snackBar.open("Member deleted","", {
                duration: 2000,
            });          
            this.dialogRef.close();
        }
    }

    onClose() {
        this.dialogRef.close();
    }
}
