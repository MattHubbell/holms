import { Injectable }           from '@angular/core';
import { AdItem }               from './ad-item';
import { AlphabeticalListOfMembers }        from './components/alphabetical-list-of-members.component';
import { MembersByMemberType }              from "./components/members-by-member-type.component";
import { MemberLabels }                     from "./components/members-labels.component";

@Injectable()
export class AdService {
  getAds() {
    return [
      new AdItem( AlphabeticalListOfMembers, { name: 'alphabeticalListOfMembers' }),
      new AdItem( MembersByMemberType, { name: 'membersByMemberType' }),
      new AdItem( MemberLabels, { name: 'memberLabels' }),
    ];
  }
}
