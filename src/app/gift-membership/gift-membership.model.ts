import { MemberType } from '../admin/member-types';
import * as f from '../shared/functions';

export class GiftMembership {
    donorMemberNo: string;
    tranDate: Date;
    checkNo: string;
    checkDate: Date;
    duesAmount: number;
    duesQuantity: number;
    recipientMemberNo: string;
    recipientName: string;
    street1: string;
    street2: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    eMailAddr: string;
    shipToRecipient: boolean;
    annualName: string;
    merchandisePackageAmount: number;
    shippingCharges: number;
    isMerchandiseChecked: boolean;
    isMerchandiseShipped: boolean;
    comments: string;

    constructor(
        donorMemberNo?: string,
        tranDate?: Date, 
        checkNo?: string,
        checkDate?: Date,
        duesAmount?: number, 
        duesQuantity?: number,
        recipientMemberNo?: string,
        recipientName?: string,
        street1?: string,
        street2?: string,
        city?: string,
        state?: string,
        zip?: string,
        country?: string,
        eMailAddr?: string,
        shipToRecipient?: boolean,
        annualName?: string,
        merchandisePackageAmount?: number,
        shippingCharges?: number,
        isMerchandiseChecked?: boolean,
        isMerchandiseShipped?: boolean,
        comments?: string
        ) {
        this.donorMemberNo = (donorMemberNo) ? donorMemberNo : '';
        this.tranDate = (tranDate) ? tranDate : null; 
        this.checkNo = (checkNo) ? checkNo : '';
        this.checkDate = (checkDate) ? checkDate : undefined;
        this.duesAmount = (duesAmount) ? duesAmount : 0; 
        this.duesQuantity = (duesQuantity) ? duesQuantity : 1;
        this.recipientMemberNo = (recipientMemberNo) ? recipientMemberNo : '';
        this.recipientName = (recipientName) ? recipientName : '';
        this.street1 = (street1) ? street1 : '';
        this.street2 = (street2) ? street2 : '';
        this.city = (city) ? city : '';
        this.state = (state) ? state : '';
        this.zip = (zip) ? zip: '';
        this.country = (country) ? country : '';
        this.eMailAddr = (eMailAddr) ? eMailAddr : '';
        this.shipToRecipient = (shipToRecipient) ? shipToRecipient : false;
        this.annualName = (annualName) ? annualName : '';
        this.merchandisePackageAmount = (merchandisePackageAmount) ? merchandisePackageAmount : 0;
        this.shippingCharges = (shippingCharges) ? shippingCharges : 0;
        this.isMerchandiseChecked = (isMerchandiseChecked) ? isMerchandiseChecked : false;
        this.isMerchandiseShipped = (isMerchandiseShipped) ? isMerchandiseShipped : false;
        this.comments = (comments) ? comments : '';
    }

    set membershipTotal(value:number) {
        // needed to handle exception when deployed
    }

    get membershipTotal(): number {
        let total:number = f.castNumber(this.duesAmount * this.duesQuantity) + this.merchandisePackageAmount + this.shippingCharges;
        return total;
    }

    set memberTypes(value: any) {
        this._memberTypes = value;
    }
    get memberTypes() {
        return this._memberTypes;
    }
    private _memberTypes: MemberType[];

    set membershipLevel(value:string) {
        // needed to handle exception when deployed
    }

    get membershipLevel(): string {

        if (this.memberTypes == undefined) {
            return '';
        }
        let memberType:MemberType = this.memberTypes.filter((x: MemberType) => x.level == 10)[0];
        return '* ' + memberType.description.charAt(0).toUpperCase() + memberType.description.slice(1).toLowerCase() + ' *';
    }

    get membershipTypeId(): string {
        if (this.memberTypes == undefined) {
            return '';
        }
        let memberType:MemberType = this.memberTypes.filter((x: MemberType) => x.level == 10)[0];
        return memberType.id;
    }

    public static clone(model: GiftMembership): GiftMembership {
        return f.clone(model);
    }

    public static TableName(): string {
        return 'giftMemberships';
    }

    public static setData(model: GiftMembership): any {
        return {
            donorMemberNo: ((model.donorMemberNo) ? model.donorMemberNo : ''), 
            tranDate: ((model.tranDate) ? f.toDatabaseDate(model.tranDate) : null),
            checkNo: ((model.checkNo) ? model.checkNo : ''), 
            checkDate: ((model.checkDate) ? f.toDatabaseDate(model.checkDate) : null),
            recipientMemberNo: ((model.recipientMemberNo) ? model.recipientMemberNo : ''),
            recipientName: ((model.recipientName) ? model.recipientName.toUpperCase() : ''), 
            street1: ((model.street1) ? model.street1.toUpperCase() : ''),
            street2: ((model.street2) ? model.street2.toUpperCase() : ''),
            city: ((model.city) ? model.city.toUpperCase() : ''),
            state: ((model.state) ? model.state.toUpperCase() : ''),
            zip: ((model.zip) ? model.zip.toUpperCase(): ''),
            country: ((model.country) ? model.country.toUpperCase(): ''),
            eMailAddr: ((model.eMailAddr) ? model.eMailAddr : ''), 
            shipToRecipient: ((model.shipToRecipient) ? model.shipToRecipient : false), 
            annualName: ((model.annualName) ? f.camelCase(model.annualName) : ''),
            merchandisePackageAmount: ((model.merchandisePackageAmount) ? model.merchandisePackageAmount : 0),
            shippingCharges: ((model.shippingCharges) ? model.shippingCharges : 0),
            isMerchandiseChecked: ((model.isMerchandiseChecked) ? model.isMerchandiseChecked : false),
            isMerchandiseShipped: ((model.isMerchandiseShipped) ? model.isMerchandiseShipped : false),
            comments: ((model.comments) ? model.comments : '')
        };
    }
}
