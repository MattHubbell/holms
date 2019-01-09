import { BrowserModule }                                  from '@angular/platform-browser';
import { NgModule }                                       from '@angular/core';
import { FormsModule, ReactiveFormsModule }               from '@angular/forms';
import { BrowserAnimationsModule }                        from '@angular/platform-browser/animations';
import { NgbModule } 			                                from '@ng-bootstrap/ng-bootstrap';

import { FirebaseModule }                                 from './firebase/firebase.module';
import { AppRoutingModule }                               from './app-routing.module';
import { MaterialModule }                                 from "./material.module";

import { AppService }                                     from './app.service';
import { TitleService }                                   from './title.service';
import { AuthModule }                                     from './auth/auth.module';
import { AdminModule }                                    from './admin/admin.module';
import { DashboardModule } 	                              from './dashboard/dashboard.module';
import { MemberModule } 		                              from './members/member.module';
import { MembershipDuesModule } 		                      from './membership-dues/membership-dues.module';
import { GiftMembershipModule } 		                      from './gift-membership/gift-membership.module';
import { ReportsModule }                                  from './reports/reports.module';
import { ExportsModule }                                  from './exports/exports.module';
import { ImportsModule }                                  from './imports/imports.module';
import { AppComponent }                                   from './app.component';
import { CookieService }                                  from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    FirebaseModule,
    AuthModule,
    AdminModule,
    DashboardModule,
    MemberModule,
    MembershipDuesModule,
    GiftMembershipModule,
    ReportsModule,
    ExportsModule,
    ImportsModule,
    MaterialModule,
  ],
  entryComponents: [
  ],
  providers: [AppService, TitleService, CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
