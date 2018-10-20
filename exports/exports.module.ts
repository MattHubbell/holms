import { NgModule }             from '@angular/core';
import { CommonModule } 		from '@angular/common';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';

import { SharedModule }         from '../shared/shared.module';
import { ListExportsComponent } from './list-exports.component';
import { MaterialModule }       from '../material.module';

@NgModule({
    imports: [ 
        CommonModule, 
        FormsModule, 
        ReactiveFormsModule, 
        SharedModule, 
        MaterialModule
    ],
    declarations: [ ListExportsComponent ],
})
export class ExportsModule {}
