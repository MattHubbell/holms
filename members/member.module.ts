import { NgModule }             from '@angular/core';
import { CommonModule } 		from '@angular/common';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';

import { SharedModule }         from '../shared/shared.module';
import { ListMemberComponent }  from './list-members.component';
import { MemberService }        from './member.service';
import { MemberModalContent }   from './member.modal';
import { MaterialModule }       from '../material.module';


@NgModule({
    imports: [ 
        CommonModule, 
        FormsModule, 
        ReactiveFormsModule, 
        SharedModule, 
        MaterialModule 
    ],
    declarations: [ ListMemberComponent, MemberModalContent ],
    entryComponents: [ MemberModalContent ],
    providers: [ MemberService ]
})
export class MemberModule {}
