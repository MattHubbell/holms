import { NgModule }                           from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule }                       from '@angular/common';

import { authRouting }                        from './auth.routing';
import { LoginComponent }                     from './login.component';
import { RegisterComponent }                  from './register.component';
import { ResetPasswordComponent }             from './reset-password.component';
import { PasswordStrengthBar }                from './password-strength-bar';
import { NewRegistrationComponent }           from './new-registration.component';
import { SharedModule }                       from '../shared/shared.module';
import { RegisterDialog }                     from './register-dialog.component';
import { MaterialModule }                     from '../material.module';
@NgModule({
  imports: [ 
    authRouting,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MaterialModule,
    SharedModule
   ],
  declarations: [ 
    RegisterComponent,
    LoginComponent,
    ResetPasswordComponent,
    PasswordStrengthBar,
    NewRegistrationComponent,
    RegisterDialog
  ],
  entryComponents: [
    RegisterDialog
  ]
})
export class AuthModule { }
