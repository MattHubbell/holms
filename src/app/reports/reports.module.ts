import { NgModule }                 from '@angular/core';
import { CommonModule } 		    from '@angular/common';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { SharedModule }             from '../shared/shared.module';
import { WjInputModule }            from 'wijmo/wijmo.angular2.input';
import { ReportsComponent }         from './reports.component';
import { ReportOptionsDialog }      from './reports.modal';

import { AlphabeticalListOfMembers }        from './components/alphabetical-list-of-members.component';
import { ActiveMembersByMemberType }        from "./components/active-members-by-member-type.component";
import { AnnualMembership }                 from "./components/annual-membership.component";
import { MembersByMemberType }              from "./components/members-by-member-type.component";
import { MemberLabels }                     from "./components/members-labels.component";
import { CashReceiptsDistributionHistory }  from "./components/cash-receipts-distribution-history.component";
import { CashReceiptsDistributionSummary }  from "./components/cash-receipts-distribution-summary.component";

import { AdService }   from './ad.service';
import { AdDirective } from './ad.directive';

@NgModule({
    imports: [ 
        CommonModule, 
        FormsModule, 
        ReactiveFormsModule, 
        SharedModule, 
        WjInputModule 
    ],
    declarations: [ 
        ReportsComponent,
        ReportOptionsDialog,
        ActiveMembersByMemberType,
        AnnualMembership,
        AlphabeticalListOfMembers,
        MembersByMemberType,
        MemberLabels,
        CashReceiptsDistributionHistory,
        CashReceiptsDistributionSummary,
        AdDirective
    ],
    providers: [ AdService ],
    entryComponents: [
        ReportOptionsDialog,
        ActiveMembersByMemberType,
        AnnualMembership, 
        AlphabeticalListOfMembers,
        MembersByMemberType,
        MemberLabels,
        CashReceiptsDistributionHistory,
        CashReceiptsDistributionSummary
    ]
})
export class ReportsModule {}
