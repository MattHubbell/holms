import { NgModule }                 from '@angular/core';
import { CommonModule } 		    from '@angular/common';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { SharedModule }             from '../shared/shared.module';
import { MembershipDuesComponent }  from './membership-dues.component';
import { MembershipDuesService }    from './membership-dues.service';
import { PayPalSubmit }             from './paypal.component';
import { CustomFormsModule }        from 'ng2-validation';

@NgModule({
    imports: [ 
        CommonModule, 
        FormsModule, 
        ReactiveFormsModule, 
        SharedModule, 
        CustomFormsModule 
    ],
    declarations: [ MembershipDuesComponent, PayPalSubmit ],
    entryComponents: [ PayPalSubmit ],
    providers: [ MembershipDuesService ], 
    })
export class MembershipDuesModule {}
