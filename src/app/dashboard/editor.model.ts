import * as f from '../shared/functions';

export class Editor {
    welcomeContent?:string;

    constructor(welcomeContent?:string) {
        this.welcomeContent = (welcomeContent) ? welcomeContent : ''; 
    }

    public static clone(model: Editor): Editor {
        return f.clone(model);
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
