import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';

import { MemberService } from "../../members/member.service";

import * as wjcCore from 'wijmo/wijmo';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'member-labels-cmp',
    styleUrls: [ './members-labels.component.css' ], 
    templateUrl: './members-labels.component.html'
})

export class MemberLabels implements OnInit, OnDestroy {

    members: wjcCore.CollectionView;
    subscription: Array<Subscription>;

    constructor( private memberService: MemberService) {
        wjcCore.setLicenseKey(environment.wijmoDistributionKey);
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
