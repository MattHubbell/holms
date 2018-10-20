import { NgModule }             from '@angular/core';
import { CommonModule } 		from '@angular/common';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';

import { SharedModule }         from '../shared/shared.module';
import { ListImportsComponent } from './list-imports.component';
import { MaterialModule }       from '../material.module';
import { IntervalDir }          from './file-reader.directive';

@NgModule({
    imports: [ 
        CommonModule, 
        FormsModule, 
        ReactiveFormsModule, 
        SharedModule, 
        MaterialModule 
    ],
    declarations: [ ListImportsComponent, IntervalDir ],
})
export class ImportsModule {}
