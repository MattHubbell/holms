import { NgModule }                 from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }             from '@angular/common';  
import { BrowserModule }            from '@angular/platform-browser';
import { BrowserAnimationsModule }  from '@angular/platform-browser/animations';
import { EmailService }             from './email.service';
import { NgbModule } 			    from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmDefault }      from './modal/confirm-btn-default';
import { ModalConfirmPrimary }      from './modal/confirm-btn-primary';
import { ModalMessageOk, MessageBtnOkComponent } from './modal/message-btn-ok';
import { EnumKeysPipe }             from './enum-keys.pipe';
import { CamelCasePipe }            from "./pipes";
import { ShowHideInput }            from './show-hide.directive';
import { PaypalButton }             from "./paypal-button";
import { MaterialModule }           from "../material.module";
import { HttpClientModule }         from '@angular/common/http'; 
import { HttpModule }               from '@angular/http';
import { ValidateIdDirective }      from "./validate-id.directive";
import { FilterPipe }               from "./filter-pipe";
import { CustomInputDirective }     from "./custom-input.directive";
import { MultiDatepickerModule }    from "./multi-date-picker/multi-date-picker.module";

import {A11yModule} from '@angular/cdk/a11y';
import {BidiModule} from '@angular/cdk/bidi';
import {ObserversModule} from '@angular/cdk/observers';
import {OverlayModule} from '@angular/cdk/overlay';
import {PlatformModule} from '@angular/cdk/platform';
import {PortalModule} from '@angular/cdk/portal';
import {ScrollDispatchModule} from '@angular/cdk/scrolling';
import {CdkStepperModule} from '@angular/cdk/stepper';
import {CdkTableModule} from '@angular/cdk/table';

import {
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
  } from '@angular/material';
  

@NgModule({
    imports: [ 
        NgbModule.forRoot(), 
        BrowserModule,
        BrowserAnimationsModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        HttpClientModule,
        HttpModule,

        // CDK
        A11yModule,
        BidiModule,
        ObserversModule,
        OverlayModule,
        PlatformModule,
        PortalModule,
        ScrollDispatchModule,
        CdkStepperModule,
        CdkTableModule,
    
        // Material
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatStepperModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MultiDatepickerModule
    ],
    declarations: [ 
        ModalConfirmDefault, 
        ModalConfirmPrimary, 
        ModalMessageOk, 
        MessageBtnOkComponent, 
        CustomInputDirective,
        ValidateIdDirective,
        EnumKeysPipe,
        CamelCasePipe, 
        ShowHideInput, 
        PaypalButton,
        FilterPipe
    ],
    entryComponents: [ 
        ModalMessageOk,
        MessageBtnOkComponent
    ],
    providers: [ 
        EmailService 
    ],
    exports: [ 
        ModalConfirmDefault, 
        ModalConfirmPrimary, 
        ModalMessageOk, 
        MessageBtnOkComponent,
        CustomInputDirective,
        ValidateIdDirective,
        EnumKeysPipe,
        CamelCasePipe,
        FilterPipe,  
        ShowHideInput, 
        PaypalButton, 
        MaterialModule, 
        NgbModule,
        MultiDatepickerModule,
        
        // CDK
        A11yModule,
        BidiModule,
        ObserversModule,
        OverlayModule,
        PlatformModule,
        PortalModule,
        ScrollDispatchModule,
        CdkStepperModule,
        CdkTableModule,
    
        // Material
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatStepperModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
    ]
})
export class SharedModule { }