import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Member } from "../../members/member.model";
import { MemberService } from "../../members/member.service";
import { MemberTypeService } from "../../admin/member-types/member-type.service";
import { MemberType } from '../../admin/member-types';

import { MatDialog } from '@angular/material';
import { ReportOptionsDialog, DialogData } from '../reports.modal';

import * as wjcCore from 'wijmo/wijmo';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'annual-membership-cmp',
    templateUrl: './annual-membership.component.html'
})

export class AnnualMembership implements OnInit, OnDestroy {

    selectedYear: Date;
    members: wjcCore.CollectionView;
    memberTypes: MemberType[];
    today = new Date();
    subscription: Array<Subscription>;

    public reportOptions: boolean = true;

    constructor( 
        private memberService: MemberService,
        private memberTypeService: MemberTypeService,
        public dialog: MatDialog
    ) {
        wjcCore.setLicenseKey(environment.wijmoDistributionKey);
        this.subscription = new Array<Subscription>();
    } 
    
    ngOnInit() {
        this.selectedYear = new Date();
        setTimeout(() => {
            this.setReportOptions();
        });
    }

    setReportOptions() {
        const dialogRef = this.dialog.open(ReportOptionsDialog, {
            data: { useSelectedYear: true, selectedYear: this.selectedYear }
        });
        dialogRef.afterClosed().subscribe((result) => {
            this.loadData(result.selectedYear);
        });
    }
    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe());
    }

    loadData(selectedYear: Date) {
        this.selectedYear = selectedYear;
        this.memberTypeService.getList();
        this.subscription.push(this.memberTypeService.list
            .subscribe(x => {
                this.memberTypes = x;
                this.memberService.getList();
                this.subscription.push(this.memberService.list
                    .subscribe(x => {
                        this.loadCollection(x.filter(y => y.lastDuesYear == selectedYear.getFullYear() && y.memberStatus != 'N' && y.memberStatus != 'B'));
                    })
                );
            })
        );

    }

    loadCollection(members:any) {
        this.members = new wjcCore.CollectionView(members, {
            groupDescriptions: [
                new wjcCore.PropertyGroupDescription('memberType',
                    (item, propName) => {
                        var value = item[propName];
                        return value;
                    }
                )
            ],
            sortDescriptions: ['sortName', 'memberName']
        });
        const today:Date = new Date();
        this.members.filter = function(item:Member) { 
            let paidThruDate = new Date(item.paidThruDate);
            return paidThruDate >= today; 
        };
    
        this.members.groups.sort((a,b): number => {
            return this.sortMemberType(a.name, b.name);
        });
    }

    sortMemberType(a: string, b: string) {
        let aMemberType:MemberType = this.findMemberType(a);
        let bMemberType:MemberType = this.findMemberType(b);
        if (aMemberType.level < bMemberType.level) {
            return -1;
        }
        if (aMemberType.level > bMemberType.level) {
            return 1;
        }
        return 0;
}

    findMemberType(id:string): MemberType {
        if (this.memberTypes) {
            let memberType:MemberType = this.memberTypes.find(x => x.id == id);
            if (!memberType) {
                memberType = new MemberType();
                if (id.length == 0) {
                    memberType.description = '(Blank)';
                } else {
                    memberType.description = id;
                }
            }
            return memberType;
        }
        return null;
    }
}
