import { Component } from '@angular/core';
import { TitleService } from '../title.service';

@Component({
    selector: 'new-registration',
    templateUrl: './new-registration.component.html',
    styleUrls: [ './new-registration.component.css' ]
})
export class NewRegistrationComponent {
    
    constructor(private titleService:TitleService) {
        this.titleService.selector = 'new-registration';
    }
}

