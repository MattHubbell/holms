import { Injectable, OnDestroy } from '@angular/core';
import { AppMenuService } from './admin/app-menus/app-menu.service';
import { AppMenu } from './admin/app-menus/app-menu.model';
import { Subscription } from 'rxjs';

@Injectable()
export class TitleService implements OnDestroy {
    public title: string;
    private subscription: Subscription;

    constructor(
        private appMenuService: AppMenuService
    ) {
        this.title = "Membership";
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    get selector(): string {
        let val:string;
        return val;
    }
    set selector(selector:string) {
        this.subscription = this.appMenuService.getItemByID('selector', selector)
            .subscribe( x => {
                this.title = "Membership > " + x[0].title;
            }
        );
    }
}