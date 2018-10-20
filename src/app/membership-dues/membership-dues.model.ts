import { MemberType } from '../admin/member-types';
import * as f from '../shared/functions';

export class MembershipDues {
    memberNo?:string;
    checkNo?:number;
    checkDate?:Date;
    duesAmount?:number;
    duesQuantity?:number;
    foundation?:number;
    museum_library?:number;
    scholarship?:number;
    memberTypes?: MemberType[];
    comments?: string;

    constructor(memberNo?:string, 
                checkNo?:number,
                checkDate?:Date,
                duesAmount?:number, 
                duesQuantity?:number, 
                foundation?:number, 
                museum_library?:number, 
                scholarship?:number,
                comments?:string
            ) {
        this.memberNo = (memberNo) ? memberNo : ''; 
        this.checkNo = (checkNo) ? checkNo : 0;
        this.checkDate = (checkDate) ? checkDate : undefined;
        this.duesAmount = (duesAmount) ? duesAmount : 0; 
        this.duesQuantity = (duesQuantity) ? duesQuantity : 1; 
        this.foundation = (foundation) ? foundation : 0; 
        this.museum_library = (museum_library) ? museum_library : 0; 
        this.scholarship = (scholarship) ? scholarship : 0;
        this.comments = (comments) ?  comments : '';
    }

    set membershipTotal(value:number) {
        // needed to handle exception when deployed
    }

    get membershipTotal(): number {
        let total:number = f.castNumber(this.duesAmount * this.duesQuantity) + 
                           f.castNumber(this.foundation) + 
                           f.castNumber(this.museum_library) + 
                           f.castNumber(this.scholarship);
        return total;
    }

    get membershipTypeTotal(): number {
        let total:number = f.castNumber(this.duesAmount) + 
                           f.castNumber(this.foundation) + 
                           f.castNumber(this.museum_library) + 
                           f.castNumber(this.scholarship);
        return total;
    }

    set membershipLevel(value:string) {
        // needed to handle exception when deployed
    }

    get membershipLevel(): string {

        if (this.memberTypes == undefined || this.membershipTypeTotal == undefined) {
            return '';
        }
        let total: number = this.membershipTypeTotal;
        let memberType:MemberType = this.memberTypes.filter(x => total >= +x.price)[0];
        return '* ' + memberType.description.charAt(0).toUpperCase() + memberType.description.slice(1).toLowerCase() + ' *';
    }

    set membershipTypeId(value:string) {
        // needed to handle exception when deployed
    }

    get membershipTypeId(): string {

        if (this.memberTypes == undefined || this.membershipTypeTotal == undefined) {
            return '';
        }
        let total: number = this.membershipTypeTotal;
        let memberType:MemberType = this.memberTypes.filter(x => total >= +x.price)[0];
        return memberType.id;
    }
}
