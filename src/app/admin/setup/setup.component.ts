import { Component, OnInit, OnDestroy } from '@angular/core';
import { JQueryService }    from '../../shared/jquery.service';
import { EmailService }     from '../../shared/email.service';
import { Setup }            from './setup.model';
import { SetupService }     from './setup.service';
import { TitleService }     from '../../title.service';
import { MatSnackBar }      from '@angular/material';
import { Subscription } from 'rxjs';

@Component({
	templateUrl: './setup.component.html',
	styleUrls: [ './setup.component.css' ]  
})
export class SetupComponent implements OnInit, OnDestroy {

    model: Setup;
    isNewItem: boolean;
    selectedItem: any;
    emailMsg: string;
    subscription: Subscription;

    constructor(
        private setupService: SetupService, 
        private jQueryService: JQueryService,
        private emailService: EmailService,
        private titleService: TitleService,
        public snackBar: MatSnackBar 
    ) {
        this.model = new Setup();
        this.isNewItem = true; 
        this.setupService.getItem();
        this.subscription = this.setupService.item.subscribe(x => {
            this.selectedItem = x;
            this.model = this.jQueryService.cloneObject(this.selectedItem);
            this.isNewItem = false;
        });
        this.titleService.selector = 'setup';
    }

    ngOnInit() {
        this.resetForm();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    resetForm() {
        let yearRegEx = `^(20)[0-9]{2}$`;
    }

    onSubmit(isValid:boolean) {
        let model:Setup = new Setup(this.model.duesYear); 
        if(!isValid) {
            return;
        }
        if (this.isNewItem) {
            this.setupService.addItem(model);
        } else {
            this.setupService.updateItem(this.model);
        }
        this.snackBar.open("Setup updated","", {
            duration: 2000,
        });          
    }

    onTestEmail() {
        this.emailMsg = '';
        const body = this.emailService.toInvoiceBody('Membership Chair', 'FOUNDATION', 'MUSEUM LIBRARY', 'SCHOLARSHIP' , new Date(), 'COMMENTS', 1, 20, 10, 5, 15);
        this.emailService.sendMail(this.model.membershipChairEmail, this.model.holmsEmail,  this.model.appSubTitle + ' - Test Dues Acknowledgment', body)
            .subscribe(
            message  => {
                this.emailMsg = message;
            },
            error =>  {
                this.emailMsg = error;
        });
    }
}
