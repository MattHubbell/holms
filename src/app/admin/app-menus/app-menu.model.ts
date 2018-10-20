export class AppMenu {
    menuId: string;
    title: string;
    selector: string;
    routerLink: string;
    userTypes: string[];

    constructor(
        menuId?: string,
        title?: string,
        selector?: string,
        routerLink?: string,
        userTypes?: string[],
    ) {
        this.menuId = (menuId) ? menuId : '';
        this.title = (title) ? title : '';
        this.selector = (selector) ? selector : '';
        this.routerLink = (routerLink) ? routerLink : '';
        this.userTypes = (userTypes) ? userTypes : [];
    }

    public static TableName(): string {
        return 'appMenus';
    }

    public static setMembers(model:AppMenu): any {
        return {
            menuId: ((model.menuId) ? model.menuId : ''), 
            title: ((model.title) ? model.title : ''), 
            selector: ((model.selector) ? model.selector : ''), 
            routerLink: ((model.routerLink) ? model.routerLink : ''),
            userTypes: ((model.userTypes) ? model.userTypes : []), 
        };
    }
}