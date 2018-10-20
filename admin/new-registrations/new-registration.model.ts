export class NewRegistration {
    email?: string;
    password?: string;
    salutation?: string;
    registrationName?: string;
    annualName?: string;
    sortName?: string;
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;                
    phone?: string;
    memberNo?: string;
    hgBook?: string;
    arBook?: string;
    meBook?: string;
    lastDuesYear?: number;
    memberType?: string;
    memberStatus?: string;
    isExistingMember?: boolean;
    existingMemberNo?: string;
    
    constructor(
        email?:string, 
        password?:string, 
        salutation?: string, 
        registrationName?: string, 
        annualName?: string,
        sortName?: string,
        street1?: string, 
        street2?: string, 
        city?: string, 
        state?: string, 
        zip?: string, 
        country?: string, 
        phone?: string,
        memberNo?: string,
        hgBook?: string,
        arBook?: string,
        meBook?: string,
        lastDuesYear?: number,
        memberType?: string,
        memberStatus?: string,
        isExistingMember?: boolean,
        existingMemberNo?: string
    ) {
        this.email = (email) ? email : '';
        this.password = (password) ? password : '';
        this.salutation = (salutation) ? salutation : '';
        this.registrationName = (registrationName) ? registrationName.toUpperCase() : '';
        this.annualName = (annualName) ? annualName : '';
        this.sortName = (sortName) ? sortName.toUpperCase() : '';
        this.street1 = (street1) ? street1.toUpperCase() : '';
        this.street2 = (street2) ? street2.toUpperCase() : '';
        this.city = (city) ? city.toUpperCase() : '';
        this.state = (state) ? state.toUpperCase() : '';
        this.zip = (zip) ? zip.toUpperCase() : '';
        this.country = (country) ? country.toUpperCase() : '';
        this.phone = (phone) ? phone : '';
        this.memberNo = (memberNo) ? memberNo : '';
        this.hgBook = (hgBook) ? hgBook : '';
        this.arBook = (arBook) ? arBook : '';
        this.meBook = (meBook) ? meBook : '';
        this.lastDuesYear = (lastDuesYear) ? lastDuesYear : 0;
        this.memberType = (memberType) ? memberType : '';
        this.memberStatus = (memberStatus) ? memberStatus : '';
        this.isExistingMember = (isExistingMember) ? isExistingMember : false;
        this.existingMemberNo = (existingMemberNo) ? existingMemberNo : '';
    }

    public static TableName(): string {
        return 'newRegistrations';
    }
    
    public static setData(model:NewRegistration): any {
        return {
            email : ((model.email) ? model.email : ''),
            password : ((model.password) ? model.password : ''),
            salutation : ((model.salutation) ? model.salutation : ''),
            registrationName : ((model.registrationName) ? model.registrationName.toUpperCase() : ''),
            annualName : ((model.annualName) ? model.annualName : ''),
            sortName : ((model.sortName) ? model.sortName.toUpperCase() : ''),
            street1 : ((model.street1) ? model.street1.toUpperCase() : ''),
            street2 : ((model.street2) ? model.street2.toUpperCase() : ''),
            city : ((model.city) ? model.city.toUpperCase() : ''),
            state : ((model.state) ? model.state.toUpperCase() : ''),
            zip : ((model.zip) ? model.zip.toUpperCase() : ''),
            country : ((model.country) ? model.country.toUpperCase() : ''),
            phone : ((model.phone) ? model.phone : ''),
            memberNo : ((model.memberNo) ? model.memberNo : ''),
            hgBook : ((model.hgBook) ? model.hgBook : ''),
            arBook : ((model.arBook) ? model.arBook : ''),
            meBook : ((model.meBook) ? model.meBook : ''),
            lastDuesYear : ((model.lastDuesYear) ? model.lastDuesYear : 0),
            memberType : ((model.memberType) ? model.memberType : ''),
            memberStatus : ((model.memberStatus) ? model.memberStatus : ''),
            isExistingMember: ((model.isExistingMember) ? model.isExistingMember : false),
            existingMemberNo: ((model.existingMemberNo) ? model.existingMemberNo : ''),
        };
    }
}
