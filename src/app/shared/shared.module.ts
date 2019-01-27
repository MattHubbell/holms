import { NgModule }                 from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }             from '@angular/common';  
import { BrowserModule }            from '@angular/platform-browser';
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
@NgModule({
    imports: [ 
        NgbModule.forRoot(), 
        BrowserModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MaterialModule,
        HttpClientModule,
        HttpModule
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
        NgbModule 
    ]
})
export class SharedModule { }