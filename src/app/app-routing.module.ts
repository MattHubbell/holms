import { ModuleWithProviders }      from '@angular/core';
import { RouterModule, Routes }     from '@angular/router';
import { ListMemberComponent }      from './members/list-members.component';
import { MembershipDuesComponent }  from './membership-dues/membership-dues.component';
import { GiftMembershipComponent }  from './gift-membership/gift-membership.component';
import { DashboardComponent }       from './dashboard/dashboard.component';
import { WelcomeEditorComponent }   from './dashboard/welcome-editor.component';
import { ListExportsComponent }     from './exports/list-exports.component';
import { ListImportsComponent }     from './imports/list-imports.component';
import { AuthGuard }                from './firebase/auth-guard';
import { ReportsComponent }         from './reports/reports.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [ AuthGuard ] },
  { path: 'membership-dues', component: MembershipDuesComponent, canActivate: [ AuthGuard ] },
  { path: 'gift-memberships', component: GiftMembershipComponent, canActivate: [ AuthGuard ] },
  { path: 'list-members', component: ListMemberComponent, canActivate: [ AuthGuard ] },
  { path: 'welcome-editor', component: WelcomeEditorComponent, canActivate: [ AuthGuard ] },
  { path: 'list-exports', component: ListExportsComponent, canActivate: [ AuthGuard ] },
  { path: 'list-imports', component: ListImportsComponent, canActivate: [ AuthGuard ] },
  { path: 'reports', component: ReportsComponent, canActivate: [ AuthGuard ] },
  { path: '**', redirectTo: 'login' }
];

export const AppRoutingModule: ModuleWithProviders = RouterModule.forRoot(routes);
