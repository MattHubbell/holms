import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard }                from './../firebase/auth-guard';

import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { ResetPasswordComponent } from './reset-password.component';
import { NewMemberComponent }     from './new-registration.component';

const appRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'password-reset', component: ResetPasswordComponent },
  { path: 'new-member', component: NewMemberComponent, canActivate: [ AuthGuard ] },
];

export const authRouting: ModuleWithProviders = RouterModule.forChild(appRoutes);
