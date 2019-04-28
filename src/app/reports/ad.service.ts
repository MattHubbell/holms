import { Injectable }           from '@angular/core';
import { AdItem }               from './ad-item';
import { ActiveMembersByMemberType }        from "./components/active-members-by-member-type.component";
import { AlphabeticalListOfMembers }        from "./components/alphabetical-list-of-members.component";
import { AnnualMembership }                 from "./components/annual-membership.component";
import { MembersByMemberType }              from "./components/members-by-member-type.component";
import { MemberLabels }                     from "./components/members-labels.component";
import { CashReceiptsDistributionHistory }  from "./components/cash-receipts-distribution-history.component";
import { CashReceiptsDistributionSummary }  from "./components/cash-receipts-distribution-summary.component";

@Injectable()
export class AdService {
  getAds() {
    return [
      new AdItem( ActiveMembersByMemberType, { name: 'activeMembersByMemberType' }),
      new AdItem( AlphabeticalListOfMembers, { name: 'alphabeticalListOfMembers' }),
      new AdItem( AnnualMembership, { name: 'AnnualMembership' }),
      new AdItem( CashReceiptsDistributionHistory, { name: 'cashReceiptsDistributionHistory' }),
      new AdItem( CashReceiptsDistributionSummary, { name: 'cashReceiptsDistributionSummary' }),
      new AdItem( MembersByMemberType, { name: 'membersByMemberType' }),
      new AdItem( MemberLabels, { name: 'memberLabels' }),
    ];
  }
}
