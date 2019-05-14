import { Component } from '@angular/core';
import { Subscription } from "rxjs";

import { Setup, SetupService } from '../admin/setup';
import { TitleService } from '../title.service';

@Component({
    selector: 'new-registration',
    templateUrl: './new-registration.component.html',
    styleUrls: [ './new-registration.component.css' ]
})
export class NewRegistrationComponent {
    
    public setup: Setup;
    subscription: Array<Subscription>;

    constructor(
        private setupService: SetupService,
        private titleService:TitleService
    ) {
        this.subscription = new Array<Subscription>();
		this.setupService.getItem();
		this.subscription.push(this.setupService.item.subscribe(x => {
            this.setup = x;
        }));
        this.titleService.selector = 'new-registration';
    }
}
