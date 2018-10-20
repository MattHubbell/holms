import { NgModule }                 from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule }             from '@angular/common';  
import { BrowserModule }            from '@angular/platform-browser';
import { JQueryService }            from './jquery.service';
import { EmailService }             from './email.service';
import { NgbModule } 			    from '@ng-bootstrap/ng-bootstrap';
import { ModalConfirmDefault }      from './modal/confirm-btn-default';
import { ModalConfirmPrimary }      from './modal/confirm-btn-primary';
import { ModalMessageOk, MessageBtnOkComponent } from './modal/message-btn-ok';
import { EnumKeysPipe }             from './enum-keys.pipe';
import { PhonePipe }                from './phone.pipe';
import { CamelCasePipe }            from "./pipes";
import { ShowHideInput }            from './show-hide.directive';
import { PaypalButton }             from "./paypal-button";
import { MaterialModule }           from "../material.module";
import { HttpClientModule }         from '@angular/common/http'; 
import { HttpModule }               from '@angular/http';
import { InputCustomComponent }     from './input-custom.component';
import { ValidateIdDirective }      from "./validate-id.directive";
import { FilterPipe }               from "./filter-pipe";
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
        InputCustomComponent,
        EnumKeysPipe,
        PhonePipe,
        CamelCasePipe, 
        ShowHideInput, 
        PaypalButton,
        ValidateIdDirective,
        FilterPipe
    ],
    entryComponents: [ 
        ModalMessageOk,
        MessageBtnOkComponent,
        InputCustomComponent
    ],
    providers: [ 
        JQueryService, 
        EmailService 
    ],
    exports: [ 
        ModalConfirmDefault, 
        ModalConfirmPrimary, 
        ModalMessageOk, 
        MessageBtnOkComponent,
        InputCustomComponent, 
        EnumKeysPipe,
        PhonePipe,
        CamelCasePipe,
        FilterPipe,  
        ShowHideInput, 
        PaypalButton, 
        MaterialModule, 
        NgbModule 
    ]
})
export class SharedModule { }