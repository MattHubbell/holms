import { Component, Inject } 	from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } 				from '@angular/router';
import { FirebaseService } 		from '../firebase';

@Component({
	templateUrl: './reset-password.component.html',
	styleUrls: [ './reset-password.component.css']
})

export class ResetPasswordComponent {
	public message: any;
	public resetForm: FormGroup;
	public email: string;

	constructor(private formBuilder: FormBuilder, private firebaseService: FirebaseService) {}

	ngOnInit() {
		this.email = '';
		this.resetForm = this.formBuilder.group({
			email: [this.email, [<any>Validators.required ]],
		});
	}

	onSubmit(formData:any) {
		if(formData.valid) {
			this.firebaseService.resetPassword(formData.value.email)
				.then(() => {
					this.message = 'Check your email for reset link';
				})
		}
	}
}