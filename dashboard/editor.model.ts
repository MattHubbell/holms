export class Editor {
    welcomeContent?:string;

    constructor(welcomeContent?:string) {
        this.welcomeContent = (welcomeContent) ? welcomeContent : ''; 
    }

    public static TableName(): string {
        return 'Editors';
    }
    
    public static setData(model:Editor): any {
        return {
            welcomeContent: ((model.welcomeContent) ? model.welcomeContent : ''), 
        };
    }    
}
