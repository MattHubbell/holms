import { NgModule }                 from '@angular/core';
import { CommonModule } 		    from '@angular/common';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { SharedModule }             from '../shared/shared.module';
import { WjInputModule }            from 'wijmo/wijmo.angular2.input';
import { ReportsComponent }         from './reports.component';

import { AlphabeticalListOfMembers }        from './components/alphabetical-list-of-members.component';
import { ActiveMembersByMemberType }              from "./components/active-members-by-member-type.component";
import { MembersByMemberType }              from "./components/members-by-member-type.component";
import { MemberLabels }                     from "./components/members-labels.component";
import { CashReceiptsDistributionHistory }  from "./components/cash-receipts-distribution-history.component";

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
        ActiveMembersByMemberType,
        AlphabeticalListOfMembers,
        MembersByMemberType,
        MemberLabels,
        CashReceiptsDistributionHistory,
        AdDirective
    ],
    providers: [ AdService ],
    entryComponents: [
        ActiveMembersByMemberType, 
        AlphabeticalListOfMembers,
        MembersByMemberType,
        MemberLabels,
        CashReceiptsDistributionHistory
    ]
})
export class ReportsModule {}
