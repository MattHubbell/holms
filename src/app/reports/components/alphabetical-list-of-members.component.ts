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
    selector: 'alphabetical-list-Of-members-cmp',
    templateUrl: './alphabetical-list-of-members.component.html'
})

export class AlphabeticalListOfMembers implements OnInit, OnDestroy {

    members: wjcCore.CollectionView;
    memberTypes: MemberType[];
    today = new Date();
    subscription: Array<Subscription>;

    constructor( 
        private memberService: MemberService,
        private memberTypeService: MemberTypeService
    ) {} 
    
    ngOnInit() {
        this.subscription = new Array<Subscription>();
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
                new wjcCore.PropertyGroupDescription('sortName',
                    (item: any, propName: any) => {
                        const value: string = item[propName];
                        const firstChar: string = value[0];
                        if (firstChar) {
                            return firstChar.toUpperCase();
                        } else {
                            return "";
                        }
                    }
                )
            ],
            sortDescriptions: ['sortName']
        });
    }

    findMemberType(id:string): MemberType {
        if (this.memberTypes) {
            let memberType:MemberType = this.memberTypes.find(x => x.id == id);
            return memberType;
        }
        return null;
    }

}

const routing: ModuleWithProviders = RouterModule.forChild([
    { path: '', component: AlphabeticalListOfMembers }
]);

// @NgModule({
//     imports: [CommonModule, routing],
//     declarations: [AlphabeticalListOfMembers],
// })
// export class AlphabeticalListOfMembersModule {
// }
