import { NgModule }                                       from '@angular/core';
import { CommonModule } 		                              from '@angular/common';
import { FormsModule, ReactiveFormsModule }               from '@angular/forms';
import { NgbModule } 			                                from '@ng-bootstrap/ng-bootstrap';
import { FroalaEditorModule, FroalaViewModule }           from 'angular-froala-wysiwyg';

//import { AgmCoreModule }        from 'angular2-google-maps/core';
import { DashboardComponent }                             from './dashboard.component';
import { WelcomeEditorComponent }                         from './welcome-editor.component';
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
    FroalaViewModule.forRoot()
  //   AgmCoreModule.forRoot({
  //   apiKey: 'AIzaSyCf-yUxehEcJYP2AoIa_Y7fx8ptXgXo8wo'
  // }) 
  ],
  declarations: [ DashboardComponent, WelcomeEditorComponent ],
  providers: [ EditorService ]
})
export class DashboardModule {}
