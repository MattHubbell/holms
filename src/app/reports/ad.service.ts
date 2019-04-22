import { Injectable }           from '@angular/core';
import { AdItem }               from './ad-item';
import { ActiveMembersByMemberType }        from "./components/active-members-by-member-type.component";
import { AlphabeticalListOfMembers }        from './components/alphabetical-list-of-members.component';
import { MembersByMemberType }              from "./components/members-by-member-type.component";
import { MemberLabels }                     from "./components/members-labels.component";
import { CashReceiptsDistributionHistory }  from "./components/cash-receipts-distribution-history.component";

@Injectable()
export class AdService {
  getAds() {
    return [
      new AdItem( ActiveMembersByMemberType, { name: 'activeMembersByMemberType' }),
      new AdItem( AlphabeticalListOfMembers, { name: 'alphabeticalListOfMembers' }),
      new AdItem( CashReceiptsDistributionHistory, { name: 'cashReceiptsDistributionHistory' }),
      new AdItem( MembersByMemberType, { name: 'membersByMemberType' }),
      new AdItem( MemberLabels, { name: 'memberLabels' }),
    ];
  }
}
