import { NgModule }                           from '@angular/core';
import { FormsModule, ReactiveFormsModule }   from '@angular/forms';
import { CommonModule }                       from '@angular/common';
import { NgbModule } 			                    from '@ng-bootstrap/ng-bootstrap';

import { WjInputModule }            from '@grapecity/wijmo.angular2.input';
import { AdService }   from './cash-entry/ad.service';
import { AdDirective } from './cash-entry/ad.directive';

import { SharedModule }                       from '../shared/shared.module';
import { MaterialModule }                     from '../material.module';
import { AdminRouting }                       from './admin.routing';
import { SetupComponent, SetupService }       from './setup';
import { UserComponent }                      from './user/user.component';
import { UserModalComponent }                 from './user/user.modal';
import { ListTransactionCodeComponent, TransactionCodeModalContent, TransactionCodeService }  from './transaction-codes';
import { ListMembershipUserComponent, MembershipUserModalContent, MembershipUserService }  from './membership-users';
import { ListNewRegistrationComponent, NewRegistrationModalContent, NewRegistrationService } from './new-registrations';
import { ListMemberTypeComponent, MemberTypeService, MemberTypeModalContent } from './member-types';
import { ListMemberStatusComponent, MemberStatusService, MemberStatusModalContent } from './member-status';
import { CashMasterHistoryService, CashDetailHistoryService, CashMasterHistoryModalContent, CashDetailHistoryModalContent } from './transaction-history';
import { CashMasterService, 
        CashDetailService, 
        ListCashEntryComponent, 
        CashEntryModalContent, 
        CashDetailModalContent, 
        CheckRegisterComponent, 
        EditListModalContent, 
        EditListComponent, 
        CheckRegisterModalContent, 
        DistributionSummaryComponent, 
        DistributionSummaryModalContent } from './cash-entry';
import { InvoiceComponent } from './user/invoice.component';
import { InvoiceModalContent } from './user/invoice.modal';
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
    UserComponent, 
    UserModalComponent,
    ListMemberTypeComponent,
    MemberTypeModalContent,
    ListMemberStatusComponent,
    MemberStatusModalContent,
    ListCashEntryComponent,
    CashEntryModalContent,
    CashDetailModalContent,
    CashMasterHistoryModalContent,
    CashDetailHistoryModalContent,
    ListAppMenuComponent,
    AppMenuModalContent,
    EditListModalContent, 
    EditListComponent, 
    CheckRegisterComponent,
    CheckRegisterModalContent,
    DistributionSummaryComponent,
    DistributionSummaryModalContent,
    InvoiceComponent,
    InvoiceModalContent,
    AdDirective
  ],
  entryComponents: [ 
    TransactionCodeModalContent, 
    MembershipUserModalContent, 
    NewRegistrationModalContent, 
    UserComponent, 
    UserModalComponent, 
    MemberTypeModalContent,
    MemberStatusModalContent,
    CashEntryModalContent,
    CashDetailModalContent,
    CashMasterHistoryModalContent,
    CashDetailHistoryModalContent,
    AppMenuModalContent,
    EditListModalContent, 
    EditListComponent, 
    CheckRegisterComponent,
    CheckRegisterModalContent, 
    DistributionSummaryComponent,
    DistributionSummaryModalContent,
    InvoiceComponent,
    InvoiceModalContent
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
