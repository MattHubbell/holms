import { Component, EventEmitter, Inject, NgModule, OnInit, OnDestroy } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MemberService } from "../../members/member.service";
import { Subscription } from 'rxjs';

import * as wjcCore from 'wijmo/wijmo';

@Component({
    selector: 'member-labels-cmp',
    styleUrls: [ './members-labels.component.css' ], 
    templateUrl: './members-labels.component.html'
})

export class MemberLabels implements OnInit, OnDestroy {

    members: wjcCore.CollectionView;
    subscription: Array<Subscription>;

    constructor( private memberService: MemberService) {
        this.subscription = new Array<Subscription>();
    }

    ngOnInit() {
        this.memberService.getList();
        this.subscription.push(this.memberService.list
            .subscribe(x => {
                this.loadData(x);
            })
        );
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe());
    }

    loadData(members:any) {
        this.members = new wjcCore.CollectionView(members, {
            sortDescriptions: ['sortName']
        });
    }
}

const routing: ModuleWithProviders = RouterModule.forChild([
    { path: '', component: MemberLabels }
]);

// @NgModule({
//     imports: [CommonModule, routing],
//     declarations: [MemberLabels],
// })
// export class MemberLabelsModule {
// }

// old style
// style="width:2.63in; height:1in; padding:6px; border:1px dotted #e0e0e0; page-break-inside:avoid" 
