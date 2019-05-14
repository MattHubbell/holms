import { Component, ViewChild }  from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../firebase';
import { AppService } from '../app.service'
import { ShowHideInput } from '../shared/show-hide.directive';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';
import { AES } from 'crypto-ts';
import { enc } from 'crypto-ts';

@Component({
		templateUrl: './login.component.html',
		styleUrls: [ './login.component.css' ]  
	})

export class LoginComponent {
	public appVersion: string;
	public error: any;
	public loginForm: FormGroup;
	public email: string;
	public password: string;
	@ViewChild(ShowHideInput) input: ShowHideInput;

	constructor(private formBuilder: FormBuilder, 
				private firebaseService: FirebaseService, 
				private appService: AppService,
				private cookieService: CookieService
			) { }

	ngOnInit() {
		this.appVersion = this.appService.appVersion;
		this.email = '';
		this.password = '';
		this.loginForm = this.formBuilder.group({
			email: [this.email, [<any>Validators.required ]],
			password: [this.password, [<any>Validators.required ]],
		});
		this.getLoginCookie();
	}

	onSubmit(formData: any) {
		if (!formData.valid) {
			this.error = 'Your form is invalid';
			return;
		}
		this.email = formData.value.email;
		this.password = formData.value.password;
		this.signIn();
	}

	signIn() {
		this.firebaseService.signInWithEmail(this.email, this.password)
		.then(() => {
			this.completeSignIn();
		})
		.catch(err => {
			this.onLoginError(err.message);	
		});

	}

	onGoogleLogin() {
		this.firebaseService.signInWithGoogle()
		.then(() => {
			this.completeSignIn();
		})
		.catch(err => {
			this.onLoginError(err.message);	
		});
	}

	onFacebookLogin() {
		this.firebaseService.signInWithFacebook()
		.then(() => {
			this.completeSignIn();
		})
		.catch(err => {
			this.onLoginError(err.message);	
		});
	}

	completeSignIn() {
		if (this.firebaseService.authenticated) {
			this.setLoginCookie();
			this.appService.userEmail = this.email;
			this.appService.onSuccessfulSignIn();
		} else {
			this.error = 'Your email address and password are not found';
		}
	}

	setLoginCookie() {
		const salt: string = environment.firebaseConfig.apiKey;
		const user: User = new User();
		user.email = this.email;
		user.password = this.password;
		const ciphertext = AES.encrypt(JSON.stringify(user), salt);
		this.cookieService.set('ADR', ciphertext.toString());
	}

	getLoginCookie() {
		if (this.cookieService.check('ADR')){
			const ciphertext = this.cookieService.get('ADR');
			const salt: string = environment.firebaseConfig.apiKey;
			const bytes: any = AES.decrypt(ciphertext, salt);
			const user: any = JSON.parse(bytes.toString(enc.Utf8));
			this.email = user.email;
			this.password = user.password;
			this.appService.isAutoLogin = true;
			this.signIn();
		}
	}

	onLoginError(message:string) {
		var re = /no user record/gi; 
		if (message.search(re)) { 
			this.error = 'Your email address and password are not found';
		} else { 
			this.error = message;
		} 
	}

	onPasswordMouseDown() {
        this.input.changeType("text");
	}

	onPasswordMouseUp() {
        this.input.changeType("password");
	}
}

export class User {
	email: string;
	password: string;
}
