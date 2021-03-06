import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { MemberType } from '../../admin/member-types';
import { MemberService } from "../../members/member.service";
import { MemberTypeService } from "../../admin/member-types/member-type.service";

import * as wjcCore from '@grapecity/wijmo';
import { environment } from '../../../environments/environment';


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
    ) {
        wjcCore.setLicenseKey(environment.wijmoDistributionKey);
    } 
    
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
