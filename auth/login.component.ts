import { Component, Inject, ViewChild }  from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { FirebaseService }    from '../firebase';
import { AppService }         from '../app.service'
import { ShowHideInput } from '../shared/show-hide.directive';

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
				private appService: AppService
			) { }

	ngOnInit() {
		this.appVersion = this.appService.appVersion;
		this.email = '';
		this.password = '';
		this.loginForm = this.formBuilder.group({
			email: [this.email, [<any>Validators.required ]],
			password: [this.password, [<any>Validators.required ]],
		});
	}

	onSubmit(formData) {
		if (!formData.valid) {
			this.error = 'Your form is invalid';
			return;
		}
		this.firebaseService.signInWithEmail(formData.value.email, formData.value.password)
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
			this.appService.userEmail = this.email;
			this.appService.onSuccessfulSignIn();
		} else {
			this.error = 'Your email address and password are not found';
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
