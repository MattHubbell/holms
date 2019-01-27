import * as f from '../../shared/functions';

export class MemberType {
    id?: string;
    description?: string;
    level?: number;
    price?: string;

    constructor(id?:string, 
                description?:string, 
                level?:number,
                price?:string,
            ) {
        this.id = (id) ? id : '';
        this.description = (description) ? description : '';
        this.level = (level) ? level : 0 ;
        this.price = (price) ? price : '0.00';
    }

    public static clone(model: MemberType): MemberType {
        return f.clone(model);
    }

    public static TableName(): string {
        return 'memberTypes';
    }

    public static setData(model:MemberType): any {
        return {
        id: ((model.id) ? model.id.toUpperCase() : ''), 
        description: ((model.description) ? model.description.toUpperCase() : ''), 
        level: ((model.level) ? model.level : 0), 
        price: ((model.price) ? model.price : '0.00')
        };
    }    
}
