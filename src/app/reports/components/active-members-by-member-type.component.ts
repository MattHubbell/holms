import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Member } from "../../members/member.model";
import { MemberService } from "../../members/member.service";
import { MemberTypeService } from "../../admin/member-types/member-type.service";
import { MemberType } from '../../admin/member-types';

import * as wjcCore from 'wijmo/wijmo';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'active-members-by-member-type-cmp',
    templateUrl: './active-members-by-member-type.component.html'
})

export class ActiveMembersByMemberType implements OnInit, OnDestroy {

    members: wjcCore.CollectionView;
    memberTypes: MemberType[];
    today = new Date();
    subscription: Array<Subscription>;

    constructor( 
        private memberService: MemberService,
        private memberTypeService: MemberTypeService
    ) {
        wjcCore.setLicenseKey(environment.wijmoDistributionKey);
        this.subscription = new Array<Subscription>();
    } 
    
    ngOnInit() {
        this.memberTypeService.getList();
        this.subscription.push(this.memberTypeService.list
            .subscribe(x => {
                this.memberTypes = x;
                this.memberService.getList();
                this.subscription.push(this.memberService.list
                    .subscribe(x => {
                        this.loadData(x);
                    })
                );
            })
        );
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe());
    }

    loadData(members:any) {
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
