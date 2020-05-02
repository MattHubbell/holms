import * as f from '../../shared/functions';

export class MemberTypeSummary {
    year: string;
    memberTypeID: string;
    newMembersCount: number;
    newMembersSales: number;
    renewalsCount: number;
    renewalsSales: number;

    constructor(
        year?: string,
        memberTypeID?: string,
        newMembersCount?: number,
        newMembersSales?: number,
        renewalsCount?: number,
        renewalsSales?: number
    ) {
        this.year = (year) ? year : '';
        this.memberTypeID = (memberTypeID) ? memberTypeID : '';
        this.newMembersCount = (newMembersCount) ? newMembersCount : 0;
        this.newMembersSales = (newMembersSales) ? newMembersSales : 0;
        this.renewalsCount = (renewalsCount) ? renewalsCount : 0;
        this.renewalsSales = (renewalsSales) ? renewalsSales : 0;
    }

    public static clone(model: MemberTypeSummary): MemberTypeSummary {
        return f.clone(model);
    }

    public static yearCompare(a: MemberTypeSummary, b: MemberTypeSummary) {
        const valA = +a.year;
        const valB = +b.year;
        if (valA > valB) {
            return 1;
        } else {
            if (valA < valB) {
                return -1;
            }
        }
        return 0;
    }

    public static memberTypeIDCompare(a: MemberTypeSummary, b: MemberTypeSummary) {
        const valA = a.memberTypeID;
        const valB = b.memberTypeID;
        if (valA > valB) {
            return 1;
        } else {
            if (valA < valB) {
                return -1;
            }
        }
        return 0;
    }

    public static TableName(): string {
        return 'memberTypeSummary';
    }

    public static setData(model:MemberTypeSummary): any {
        return {
            year: ((model.year) ? model.year : ''), 
            memberTypeID: ((model.memberTypeID) ? model.memberTypeID : ''), 
            newMembersCount: ((model.newMembersCount) ? model.newMembersCount : 0),
            newMembersSales: ((model.newMembersSales) ? model.newMembersSales : 0),
            renewalsCount: ((model.renewalsCount) ? model.renewalsCount : 0),
            renewalsSales: ((model.renewalsSales) ? model.renewalsSales : 0) 
        };
    }
}
