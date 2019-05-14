import { NgModule }                                       from '@angular/core';
import { CommonModule } 		                              from '@angular/common';
import { FormsModule, ReactiveFormsModule }               from '@angular/forms';
import { NgbModule } 			                                from '@ng-bootstrap/ng-bootstrap';
import { FroalaEditorModule, FroalaViewModule }           from 'angular-froala-wysiwyg';
import { WjChartModule }                                  from '@grapecity/wijmo.angular2.chart';
import { WjChartAnimationModule }                         from '@grapecity/wijmo.angular2.chart.animation';
import { DashboardComponent }                             from './dashboard.component';
import { WelcomeEditorComponent }                         from './welcome-editor.component';
import { MembershipChartComponent }                       from './membership-chart.component';
import { EditorService }                                  from './editor.service';
import { MaterialModule }                                 from '../material.module';

@NgModule({
  imports: [ 
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule,
    MaterialModule, 
    NgbModule.forRoot(),     
    FroalaEditorModule.forRoot(),
    FroalaViewModule.forRoot(),
    WjChartModule, 
    WjChartAnimationModule
  ],
  declarations: [ DashboardComponent, WelcomeEditorComponent, MembershipChartComponent ],
  providers: [ EditorService ]
})
export class DashboardModule {}
