import { MemberType } from '../admin/member-types';
import * as f from '../shared/functions';

export class MembershipDues {
    memberNo?:string;
    checkNo?:string;
    checkDate?:Date;
    duesAmount?:number;
    duesQuantity?:number;
    foundationLit?:string;
    foundation?:number;
    museum_libraryLit?:string;
    museum_library?:number;
    scholarshipLit?:string;
    scholarship?:number;
    memberTypes?: MemberType[];
    comments?: string;
    duesPaidThruDate?:Date;

    constructor(memberNo?:string, 
                checkNo?:string,
                checkDate?:Date,
                duesAmount?:number, 
                duesQuantity?:number, 
                foundationLit?:string,
                foundation?:number,
                museum_libraryLit?:string, 
                museum_library?:number, 
                scholarshipLit?:string,
                scholarship?:number,
                comments?:string,
                duesPaidThruDate?:Date
            ) {
        this.memberNo = (memberNo) ? memberNo : ''; 
        this.checkNo = (checkNo) ? checkNo : '';
        this.checkDate = (checkDate) ? checkDate : undefined;
        this.duesAmount = (duesAmount) ? duesAmount : 0; 
        this.duesQuantity = (duesQuantity) ? duesQuantity : 1;
        this.foundationLit = (foundationLit) ? foundationLit : ''; 
        this.foundation = (foundation) ? foundation : 0; 
        this.museum_libraryLit = (museum_libraryLit) ? museum_libraryLit : ''; 
        this.museum_library = (museum_library) ? museum_library : 0; 
        this.scholarshipLit = (scholarshipLit) ? scholarshipLit : ''; 
        this.scholarship = (scholarship) ? scholarship : 0;
        this.comments = (comments) ?  comments : '';
        this.duesPaidThruDate = (duesPaidThruDate) ? duesPaidThruDate : undefined;
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
