export class TransactionCode {
    id?: string;
    description?: string;
    quantityRequired?: boolean;
    itemType?: TransactionCodeItemTypes;
    price?: string; 

    constructor(id?:string, 
                description?: string, 
                quantityRequired?: boolean,
                itemType?: TransactionCodeItemTypes,
                price?: string
            ) {
        this.id = (id) ? id : '';
        this.description = (description) ? description : '';
        this.quantityRequired = (quantityRequired) ? quantityRequired : false;
        this.itemType = (itemType) ? itemType : 0;
        this.price = (price) ? price : '0';
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
            price: ((model.price) ? model.price : '0')
        };
    }
}

export enum TransactionCodeItemTypes {
    Product = 0,
    Membership = 1,
    Foundation = 2,
    MuseumLibary = 3,
    ScholarshipFund = 4
}

