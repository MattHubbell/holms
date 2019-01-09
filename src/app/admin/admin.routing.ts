import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SetupComponent }               from './setup/setup.component';
import { ListCashEntryComponent }       from './cash-entry/list-cash-entry.component';
import { ListTransactionCodeComponent } from './transaction-codes/list-transaction-codes.component';
import { ListMembershipUserComponent }  from './membership-users/list-membership-users.component';
import { ListNewRegistrationComponent } from './new-registrations/list-new-registrations.component';
import { ListMemberTypeComponent }      from './member-types/list-member-type.component';
import { ListMemberStatusComponent }    from './member-status/list-member-status.component';
import { ListAppMenuComponent }         from './app-menus/list-app-menu.component';

import { AuthGuard }                    from '../firebase/auth-guard';

const appRoutes: Routes = [
  { path: 'setup', component: SetupComponent, canActivate: [ AuthGuard ] },
  { path: 'list-cash-entry', component: ListCashEntryComponent, canActivate: [ AuthGuard ] },
  { path: 'list-transaction-codes', component: ListTransactionCodeComponent, canActivate: [ AuthGuard ] },
  { path: 'list-membership-users', component: ListMembershipUserComponent, canActivate: [ AuthGuard ] },
  { path: 'list-new-registrations', component: ListNewRegistrationComponent, canActivate: [ AuthGuard ] },
  { path: 'list-member-types', component: ListMemberTypeComponent, canActivate: [ AuthGuard ] },
  { path: 'list-member-status', component: ListMemberStatusComponent, canActivate: [ AuthGuard ] },
  { path: 'list-app-menus', component: ListAppMenuComponent, canActivate: [ AuthGuard ] },
];

export const AdminRouting: ModuleWithProviders = RouterModule.forChild(appRoutes);
