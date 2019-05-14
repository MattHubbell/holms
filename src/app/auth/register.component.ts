import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { Subscription } from "rxjs";

import { FirebaseService } from '../firebase';
import { NewRegistration } from '../admin/new-registrations/new-registration.model';
import { NewRegistrationService } from '../admin/new-registrations/new-registration.service';
import { ShowHideInput } from '../shared/show-hide.directive';
import { MatDialog } from '@angular/material';
import { Member, MemberService } from '../members';
import { MembershipUser, MembershipUserType } from '../admin/membership-users/membership-user.model';
import { MembershipUserService } from '../admin/membership-users/membership-user.service';
import { AppService } from '../app.service';
import { Salutations, Countries } from '../shared';
import { Setup, SetupService } from '../admin/setup';
import { EmailService } from '../shared/email.service';
import * as f from '../shared/functions';
import { RegisterDialog } from './register-dialog.component';

@Component({
	templateUrl: './register.component.html',
	styleUrls: [ './register.component.css' ]  
})

export class RegisterComponent implements OnInit, OnDestroy{
	public error: any;
	public registrationFilled: boolean = false;
	public submitted: boolean = false;
	public model: NewRegistration;
    public members: Member[];
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
		private dialog: MatDialog,
		private newRegistrationService: NewRegistrationService,
        private memberService: MemberService,
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
        this.memberService.getList();
        this.subscription.push(this.memberService.list
            .subscribe( x=> {
				this.members = x;
            })
        );
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
			this.firebaseService.updateProfile(f.camelCase(this.model.registrationName));
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
		let membershipUser = new MembershipUser(newRegistration.registrationName, newRegistration.existingMemberNo, MembershipUserType.New);
		if (newRegistration.existingMemberNo.length > 0) {
			membershipUser.userType = MembershipUserType.Member;
		} else {
			this.sendMembershipCharEmail();
			this.newRegistrationService.addItem(this.firebaseService.user.id, newRegistration);
		}
		this.membershipUserService.addItem(this.firebaseService.user.id, membershipUser);
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

	onMemberNoChange(memberNo:any) {
        if (!this.members) {
            return;
        } 
		this.model = new NewRegistration();
		this.model.existingMemberNo = memberNo;
		this.model.isExistingMember = true;
        let member:Member = this.members.find(x => x.memberNo == memberNo);
        if (member) {
            let memberModel:Member = Member.clone(member);
			this.model.memberNo = memberModel.memberNo;
			this.model.registrationName = memberModel.memberName;
			this.model.street1 = memberModel.addrLine1;
			this.model.street2 = memberModel.addrLine2;
			this.model.city = memberModel.city;
			this.model.state = memberModel.state;
			this.model.zip = memberModel.zip;
			this.model.country = memberModel.country;
			this.model.phone = memberModel.phone;
			this.model.salutation = memberModel.salutation;
			this.model.sortName = memberModel.sortName;
			this.model.memberStatus = memberModel.memberStatus;
			this.model.memberType = memberModel.memberType;
			this.model.annualName = memberModel.annualName;
			this.model.arBook = memberModel.arBook;
			this.model.hgBook = memberModel.hgBook;
			this.model.meBook = memberModel.meBook;
			this.model.email = memberModel.eMailAddr;
			this.model.lastDuesYear = memberModel.lastDuesYear;
		}
		
		const dialogRef = this.dialog.open(RegisterDialog, {
			width: '500px',
			disableClose: true,
			data: this.model
		});
	
		dialogRef.afterClosed().subscribe(result => {
			if (result != true) {
				this.model = new NewRegistration();
			}
		});	
	}
	
	sendMembershipCharEmail(): string {
		let emailMsg: string = '';
		const body: string = this.emailService.toRegisterBody(this.model.email, this.model.registrationName, this.model.street1, this.model.street2, this.model.city, this.model.state, this.model.zip, this.model.country);
        this.emailService.sendMail(this.setup.membershipChairEmail, this.setup.holmsEmail,  this.setup.appSubTitle + ' - New Member', body)
            // , 'A new member has registered:' +`\r\n\r\n
			//    e-mail            = ` + this.model.email + `\r\n
			//    Registration Name = ` + this.model.registrationName + `\r\n
            //    Street            = ` + this.model.street1 + `\r\n
            //    Street 2          = ` + this.model.street2 + `\r\n
            //    City, State, Zip  = ` + this.model.city + `, ` + this.model.state + `  ` + this.model.zip + `\r\n
            //    Country           = ` + this.model.country + `\r\n
            // `)
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
