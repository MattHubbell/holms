import { NgModule }                           from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule }                       from '@angular/common';
import { NgbModule } 			                    from '@ng-bootstrap/ng-bootstrap';

import { WjInputModule }            from 'wijmo/wijmo.angular2.input';
import { AdService }   from './cash-entry/ad.service';
import { AdDirective } from './cash-entry/ad.directive';

import { SharedModule }                       from '../shared/shared.module';
import { MaterialModule }                     from '../material.module';
import { AdminRouting }                       from './admin.routing';
import { SetupComponent, SetupService }       from './setup';
import { UserModalComponent }                 from './user/user.modal';
import { ListTransactionCodeComponent, TransactionCodeModalContent, TransactionCodeService }  from './transaction-codes';
import { ListMembershipUserComponent, MembershipUserModalContent, MembershipUserService }  from './membership-users';
import { ListNewRegistrationComponent, NewRegistrationModalContent, NewRegistrationService } from './new-registrations';
import { ListMemberTypeComponent, MemberTypeService, MemberTypeModalContent } from './member-types';
import { ListMemberStatusComponent, MemberStatusService, MemberStatusModalContent } from './member-status';
import { CashMasterHistoryService, CashDetailHistoryService } from './transaction-history';
import { CashMasterService, CashDetailService, ListCashEntryComponent, CashEntryModalContent, CashDetailModalContent, CheckRegisterComponent, CheckRegisterModalContent, DistributionSummaryComponent, DistributionSummaryModalContent } from './cash-entry';
import { AppMenuService, ListAppMenuComponent, AppMenuModalContent } from './app-menus';

@NgModule({
  imports: [ 
    FormsModule, 
    ReactiveFormsModule, 
    CommonModule, 
    NgbModule, 
    SharedModule,
    MaterialModule, 
    AdminRouting,
    WjInputModule 
  ],
  declarations: [ 
    SetupComponent,
    ListTransactionCodeComponent, 
    TransactionCodeModalContent, 
    ListMembershipUserComponent,
    MembershipUserModalContent,
    ListNewRegistrationComponent,
    NewRegistrationModalContent,
    UserModalComponent,
    ListMemberTypeComponent,
    MemberTypeModalContent,
    ListMemberStatusComponent,
    MemberStatusModalContent,
    ListCashEntryComponent,
    CashEntryModalContent,
    CashDetailModalContent,
    ListAppMenuComponent,
    AppMenuModalContent,
    CheckRegisterComponent,
    CheckRegisterModalContent,
    DistributionSummaryComponent,
    DistributionSummaryModalContent,
    AdDirective
  ],
  entryComponents: [ 
    TransactionCodeModalContent, 
    MembershipUserModalContent, 
    NewRegistrationModalContent, 
    UserModalComponent, 
    MemberTypeModalContent,
    MemberStatusModalContent,
    CashEntryModalContent,
    CashDetailModalContent,
    AppMenuModalContent,
    CheckRegisterComponent,
    CheckRegisterModalContent, 
    DistributionSummaryComponent,
    DistributionSummaryModalContent
  ],
  providers: [ 
    SetupService, 
    TransactionCodeService, 
    MembershipUserService, 
    NewRegistrationService,
    MemberTypeService,
    MemberStatusService,
    CashMasterService,
    CashDetailService, 
    CashMasterHistoryService,
    CashDetailHistoryService,
    AppMenuService,
    AdService 
  ]
})
export class AdminModule { }
