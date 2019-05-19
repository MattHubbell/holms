//import 'bootstrap.css';
import '@grapecity/wijmo.styles/wijmo.css';
//import './styles.css';

import { Component, OnDestroy } from '@angular/core';
import { MemberTypeService, MemberType } from '../admin/member-types';
import { CashDetailHistoryService, CashDetailHistory } from '../admin/transaction-history';
import { Subscription } from 'rxjs';

import * as wjcCore from '@grapecity/wijmo';
import { environment } from '../../environments/environment';

@Component({
    selector: 'membership-chart-component',
    templateUrl: './membership-chart.component.html',
    styleUrls: [ './membership-chart.component.css' ]
})
export class MembershipChartComponent implements OnDestroy {
    data: any[];
    membershipSummaryData: Array<MembershipSummary>;
    chartTitle: string;
    memberTypes: MemberType[]; 
    subscription: Array<Subscription>;

    constructor(
        private memberTypeService: MemberTypeService,
        private cashDetailHistoryService: CashDetailHistoryService
    ) {
        wjcCore.setLicenseKey(environment.wijmoDistributionKey);
        this.chartTitle = (new Date()).getFullYear() + ' Membership';
        this.loadMemberTypes();
    }

    ngOnDestroy() {
        this.subscription.forEach(x => x.unsubscribe());
    }

    loadMemberTypes() {
        this.membershipSummaryData = new Array<MembershipSummary>();
        this.subscription = new Array<Subscription>();
        this.memberTypeService.getList();
        this.subscription.push(this.memberTypeService.list
            .subscribe(x => {
                const memberTypes = x.sort(this.compareMemberTypeLevels);
                this.loadCashDetailHistory(memberTypes);
            })
        );
    }

    loadCashDetailHistory(memberTypes: Array<MemberType>) {
        this.memberTypes = memberTypes;
        let ctr:number = 0;
        this.memberTypes.forEach(x => {
            let membershipSummary = new MembershipSummary();
            membershipSummary.membershipID = x.id;
            membershipSummary.membershipType = x.description;
            membershipSummary.count = ctr;
            this.membershipSummaryData.push(membershipSummary);
        });
        const duesYear = (new Date()).getFullYear().toString();
        this.cashDetailHistoryService.getListByDuesYear(duesYear);
        this.subscription.push(this.cashDetailHistoryService.list
            .subscribe(x => {
                x.forEach(cashDetailHistory => {
                    this.loadMembershipSummary(cashDetailHistory);        
                })
                this.data = this.membershipSummaryData;
            })
        );
    }

    loadMembershipSummary(cashDetailHistory: CashDetailHistory) {
        let membershipSummary = this.membershipSummaryData.find(x => x.membershipID == cashDetailHistory.duesCode);
        if (membershipSummary) {
            membershipSummary.count += 1;
        }
    }

    compareMemberTypeLevels(a:MemberType, b:MemberType) {
        return +a.level - +b.level;
    }
}

export class MembershipSummary {
    membershipID: string;
    membershipType: string;
    count: number;
}
