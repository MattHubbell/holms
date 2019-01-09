import * as f from '../shared/functions';

export class Member {
    memberNo: string;
    oldMemberNo: number;
    sortName: string;
    salutation: string;
    memberName: string;
    addrLine1: string;
    addrLine2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    hgBook: string;
    arBook: string;
    meBook: string;
    annualName: string;
    lastDuesYear: number;
    startYear: number;
    anniversary: Date;
    paidThruDate: Date; 
    memberType: string;
    memberStatus: string;
    eMailAddr: string;
    fax: string;
    comments: string;
    isAlternateAddress: boolean;
    giftFromMember: string;
    printCertification: boolean;
    certificationDate: string;

    constructor(
        memberNo?: string,
        oldMemberNo?: number,
        sortName?: string,
        salutation?: string,
        memberName?: string,
        addrLine1?: string,
        addrLine2?: string,
        city?: string,
        state?: string,
        zip?: string,
        country?: string,
        phone?: string,
        hgBook?: string,
        arBook?: string,
        meBook?: string,
        annualName?: string,
        lastDuesYear?: number,
        startYear?: number,
        anniversary?: Date,
        paidThruDate?: Date, 
        memberType?: string,
        memberStatus?: string,
        eMailAddr?: string,
        fax?: string,
        comments?: string,
        isAlternateAddress?: boolean,
        giftFromMember?: string,
        printCertification?: boolean,
        certificationDate?: string
    ) {
        this.memberNo = (memberNo) ? memberNo : '';
        this.oldMemberNo = (oldMemberNo) ? oldMemberNo : 0;
        this.sortName = (sortName) ? sortName.toUpperCase() : '';
        this.salutation = (salutation) ? salutation : '';
        this.memberName = (memberName) ? memberName.toUpperCase() : '';
        this.addrLine1 = (addrLine1) ? addrLine1.toUpperCase() : '';
        this.addrLine2 = (addrLine2) ? addrLine2.toUpperCase() : '';
        this.city = (city) ? city.toUpperCase() : '';
        this.state = (state) ? state.toUpperCase() : '';
        this.zip = (zip) ? zip.toUpperCase() : '';
        this.country = (country) ? country.toUpperCase() : '';
        this.phone = (phone) ? phone : '';
        this.hgBook = (hgBook) ? hgBook : '';
        this.arBook = (arBook) ? arBook : '';
        this.meBook = (meBook) ? meBook : '';
        this.annualName = (annualName) ? annualName : '';
        this.lastDuesYear = (lastDuesYear) ? lastDuesYear : 0;
        this.startYear = (startYear) ? startYear : 0;
        this.anniversary = (anniversary) ? anniversary : null,
        this.paidThruDate = (paidThruDate) ? paidThruDate : null, 
        this.memberType = (memberType) ? memberType : '';
        this.memberStatus = (memberStatus) ? memberStatus : '';
        this.eMailAddr = (eMailAddr) ? eMailAddr : '';
        this.fax = (fax) ? fax : '';
        this.comments = (comments) ? comments : '';
        this.isAlternateAddress = (isAlternateAddress) ? isAlternateAddress : false;
        this.giftFromMember = (giftFromMember) ? giftFromMember : '';
        this.printCertification = (printCertification) ? printCertification : false;
        this.certificationDate = (certificationDate) ? certificationDate : '';
    }

    public static TableName(): string {
        return 'members';
    }

    public static setData(model:Member): any {
        return {
            memberNo: ((model.memberNo) ? model.memberNo : ''), 
            oldMemberNo: ((model.oldMemberNo) ? model.oldMemberNo : 0),
            sortName: ((model.sortName) ? model.sortName.toUpperCase() : ''),
            salutation: ((model.salutation) ? model.salutation : ''), 
            memberName: ((model.memberName) ? model.memberName.toUpperCase() : ''), 
            addrLine1: ((model.addrLine1) ? model.addrLine1.toUpperCase() : ''),
            addrLine2: ((model.addrLine2) ? model.addrLine2.toUpperCase() : ''),
            city: ((model.city) ? model.city.toUpperCase() : ''),
            state: ((model.state) ? model.state.toUpperCase() : ''),
            zip: ((model.zip) ? model.zip.toUpperCase(): ''),
            country: ((model.country) ? model.country.toUpperCase(): ''),
            phone: ((model.phone) ? model.phone : ''),
            hgBook: ((model.hgBook) ? model.hgBook : ''),
            arBook: ((model.arBook) ? model.arBook : ''),
            meBook: ((model.meBook) ? model.meBook : ''),
            annualName: ((model.annualName) ? f.camelCase(model.annualName) : ''),
            lastDuesYear: ((model.lastDuesYear) ? model.lastDuesYear : 0),
            startYear: ((model.startYear) ? model.startYear : 0),
            anniversary: ((model.anniversary) ? f.toDatabaseDate(model.anniversary) : null),
            paidThruDate: ((model.paidThruDate) ? f.toDatabaseDate(model.paidThruDate) : null), 
            memberType: ((model.memberType) ? model.memberType : ''),
            memberStatus: ((model.memberStatus) ? model.memberStatus : ''),
            eMailAddr: ((model.eMailAddr) ? model.eMailAddr : ''),
            fax: ((model.fax) ? model.fax : ''),
            comments: ((model.comments) ? model.comments : ''),
            isAlternateAddress: ((model.isAlternateAddress) ? model.isAlternateAddress : false),
            giftFromMember: ((model.giftFromMember) ? model.giftFromMember : ''),
            printCertification: ((model.printCertification) ? model.printCertification : false),
            certificationDate: ((model.certificationDate) ? model.certificationDate : '')
        };
    }
}

export enum MemberFilterOptions {
    Everything = 0,
    Member_No = 1,
    ME_Book = 2,
    City = 3,
    Zip = 4
}
