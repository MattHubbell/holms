import { NgModule }                 from '@angular/core';
import { CommonModule } 		    from '@angular/common';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { SharedModule }             from '../shared/shared.module';
import { GiftMembershipComponent }  from './gift-membership.component';
import { GiftMembershipService }    from './gift-membership.service';
import { CustomFormsModule }        from 'ng2-validation';

@NgModule({
    imports: [ 
        CommonModule, 
        FormsModule, 
        ReactiveFormsModule, 
        SharedModule, 
        CustomFormsModule 
    ],
    declarations: [ GiftMembershipComponent ],
    providers: [ GiftMembershipService ], 
    })
export class GiftMembershipModule {}
