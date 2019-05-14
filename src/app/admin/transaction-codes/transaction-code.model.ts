import * as f from '../../shared/functions';

export class TransactionCode {
    id: string;
    description: string;
    quantityRequired: boolean;
    itemType: TransactionCodeItemTypes;
    price: string;
    isGiftItem: boolean; 

    constructor(id?:string, 
                description?: string, 
                quantityRequired?: boolean,
                itemType?: TransactionCodeItemTypes,
                price?: string,
                isGiftItem?: boolean
            ) {
        this.id = (id) ? id : '';
        this.description = (description) ? description : '';
        this.quantityRequired = (quantityRequired) ? quantityRequired : false;
        this.itemType = (itemType) ? itemType : 0;
        this.price = (price) ? price : '0';
        this.isGiftItem = (isGiftItem) ? isGiftItem : false;
    }

    public static clone(model: TransactionCode): TransactionCode {
        return f.clone(model);
    }

    public static TableName(): string {
        return 'transactionCodes';
    }

    public static setData(model:TransactionCode): any {
        return {
            id: ((model.id) ? model.id.toUpperCase() : ''), 
            description: ((model.description) ? model.description.toUpperCase() : ''), 
            quantityRequired: ((model.quantityRequired) ? model.quantityRequired : false), 
            itemType: ((model.itemType) ? model.itemType : TransactionCodeItemTypes.Product),
            price: ((model.price) ? model.price : '0'),
            isGiftItem: ((model.isGiftItem) ? model.isGiftItem : false)
        };
    }
}

export enum TransactionCodeItemTypes {
    Product = 0,
    Membership = 1,
    Foundation = 2,
    MuseumLibary = 3,
    ScholarshipFund = 4,
    Shipping = 5
}

