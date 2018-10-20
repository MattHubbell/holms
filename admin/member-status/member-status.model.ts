export class MemberStatus {
    id?: string;
    description?: string;

    constructor(id?:string, description?:string) {
        this.id = (id) ? id : '';
        this.description = (description) ? description : '';
    }

    public static TableName(): string {
        return 'memberStatus';
    }

    public static setData(model:MemberStatus): any {
    return {
        id: ((model.id) ? model.id.toUpperCase() : ''), 
        description: ((model.description) ? model.description.toUpperCase() : ''), 
        };
    }
}
