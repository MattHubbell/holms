import { Component, Input } from '@angular/core';
import { CashMaster } from './cash-master.model';
import { Member } from '../../members/member.model';

@Component({
    selector: 'check-register',
    templateUrl: './check-register.component.html'
})

export class CheckRegisterComponent  {

    @Input() batchNo: string;
    @Input() cashMasters: CashMaster[];
    @Input() members: Member[];
    
    find(memberNo:string): Member {
        if (this.members) {
            let member:Member = this.members.find(x => x.memberNo == memberNo);
            return member;
        }
        return null;
    }
    
    getBatchTotal(): number {
        let batchTotal:number = 0;
        this.cashMasters.forEach(x => batchTotal += +x.checkAmt);
        return batchTotal;
    }
}
