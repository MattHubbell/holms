import { Component, EventEmitter, Inject, NgModule, OnInit, OnDestroy } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MemberService } from "../../members/member.service";
import { MemberTypeService } from "../../admin/member-types/member-type.service";
import { Subscription } from 'rxjs';

import * as wjcCore from 'wijmo/wijmo';
import { MemberType } from '../../admin/member-types';

@Component({
    selector: 'members-by-member-type-cmp',
    templateUrl: './members-by-member-type.component.html'
})

export class MembersByMemberType implements OnInit, OnDestroy {

    members: wjcCore.CollectionView;
    memberTypes: MemberType[];
    today = new Date();
    subscription: Array<Subscription>;

    constructor( 
        private memberService: MemberService,
        private memberTypeService: MemberTypeService
    ) {
        this.subscription = new Array<Subscription>();
    } 
    
    ngOnInit() {
        this.memberService.getList();
        this.subscription.push(this.memberService.list
            .subscribe(x => {
                this.loadData(x);
            })
        );
        this.memberTypeService.getList();
        this.subscription.push(this.memberTypeService.list
            .subscribe(x => {
                this.memberTypes = x;
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
            sortDescriptions: ['memberType']
        });
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

const routing: ModuleWithProviders = RouterModule.forChild([
    { path: '', component: MembersByMemberType }
]);

// @NgModule({
//     imports: [CommonModule, routing],
//     declarations: [MembersByMemberType],
// })
// export class MembersByMemberTypeModule {
// }
