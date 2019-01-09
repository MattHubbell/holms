import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { FirebaseService } from '../firebase';
import { NewRegistration } from '../admin/new-registrations/new-registration.model';
import { NewRegistrationService } from '../admin/new-registrations/new-registration.service';
import { ShowHideInput } from '../shared/show-hide.directive';
import { MatDialog } from '@angular/material';
import { MembershipUser, MembershipUserType } from '../admin/membership-users/membership-user.model';
import { MembershipUserService } from '../admin/membership-users/membership-user.service';
import { AppService } from '../app.service';
import { Salutations, Countries } from '../shared';
import { Setup, SetupService } from '../admin/setup';
import { EmailService } from '../shared/email.service';
import { Observable } from 'rxjs';
import { Subscription } from "rxjs";

@Component({
	templateUrl: './register.component.html',
	styleUrls: [ './register.component.css' ]  
})

export class RegisterComponent implements OnInit, OnDestroy{
	public error: any;
	public registrationFilled: boolean = false;
	public submitted: boolean = false;
	public model: NewRegistration;
	public events: any[] = [];
	public salutations = Salutations;
	public countries = Countries;
    public setup: Setup;
	public step = 0;
	public barLabel = 'Strength';

	filteredOptions: Observable<string[]>;
	subscription: Array<Subscription>;

	@ViewChild(ShowHideInput) input: ShowHideInput;

	constructor(
		private firebaseService: FirebaseService, 
		public dialog: MatDialog,
		private newRegistrationService: NewRegistrationService,
		private membershipUserService: MembershipUserService,
        private setupService: SetupService,
        private emailService: EmailService,
		private appService: AppService
	) { 
		this.subscription = new Array<Subscription>();
		this.setupService.getItem();
		this.subscription.push(this.setupService.item.subscribe(x => {
            this.setup = x;
        }));
	}

	ngOnInit() {
		this.model = new NewRegistration();
	}

	ngOnDestroy() {
		this.subscription.forEach(x => x.unsubscribe);
	
	}

	onSubmit(isValid:boolean) {
		if (!isValid || this.model.email.length === 0 || this.model.password.length === 0 ) {
			return;
		}
		this.registrationFilled = true;
		this.submitted = true;
		this.firebaseService.createUser(this.model.email, this.model.password)
			.then(() => {
			this.successfulAdd(this.model);
			this.completeEmailSignin(this.model.email, this.model.password);
		}).catch((err) => {
			this.onLoginError(err.message);
		});
	}

	onGoogleLogin(member:any,isValid:boolean) {
		if (!isValid) {
			return;
		}
		this.registrationFilled = true;
		this.submitted = true;
		this.firebaseService.signInWithGoogle()
			.then(x => {
			member.email = x.user.email;
			this.successfulAdd(member);
			this.completeSignIn();
		}).catch((err) => {
			this.onLoginError(err.message);
		});
	}

	onFacebookLogin(member:any,isValid:boolean) {
		if (!isValid) {
			return;
		}
		this.registrationFilled = true;
		this.submitted = true;
		this.firebaseService.signInWithFacebook()
			.then(x => {
				member.email = x.user.email;
				this.successfulAdd(member);
			this.completeSignIn();
		}).catch((err) => {
			this.onLoginError(err.message);
		});
	}

	successfulAdd(newRegistration:NewRegistration) {
		let membershipUser = new MembershipUser(newRegistration.registrationName, '', MembershipUserType.New);
		this.membershipUserService.addItem(this.firebaseService.user.id, membershipUser);
		this.newRegistrationService.addItem(this.firebaseService.user.id, newRegistration);
		this.sendMembershipCharEmail();
	}

	completeEmailSignin(email: string, password: string) {
		this.firebaseService.signInWithEmail(email, password)
		.then(() => {
			this.completeSignIn();
		})
		.catch(err => {
			this.onLoginError(err.message);	
		});
	}

	completeSignIn() {
		if (this.firebaseService.authenticated) {
			this.appService.onSuccessfulSignIn();
		} else {
			this.error = 'Your email address and password are not found';
		}
	}

	onLoginError(message:string) {
		this.error = message;
	}

	onPasswordMouseDown() {
        this.input.changeType("text");
	}

	onPasswordMouseUp() {
        this.input.changeType("password");
	}

	sendMembershipCharEmail(): string {
        let emailMsg:string = '';
        this.emailService.sendMail(this.setup.membershipChairEmail, this.setup.holmsEmail,  this.setup.appSubTitle + ' - New Member'
            , 'A new member has registered:' +`\r\n\r\n
			   e-mail            = ` + this.model.email + `\r\n
			   Registration Name = ` + this.model.registrationName + `\r\n
               Street            = ` + this.model.street1 + `\r\n
               Street 2          = ` + this.model.street2 + `\r\n
               City, State, Zip  = ` + this.model.city + `, ` + this.model.state + `  ` + this.model.zip + `\r\n
               Country           = ` + this.model.country + `\r\n
            `)
            .subscribe(
            message  => {
                emailMsg = message;
            },
            error =>  {
                emailMsg = error;
        });
        if (emailMsg.length>0) {
            emailMsg = "E-mail sent!"
        }
        return emailMsg;
    }
}
