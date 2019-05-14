import { NgModule }                     from '@angular/core';
import { CommonModule }                 from '@angular/common';

import { AngularFireModule }            from 'angularfire2';
import { AngularFireDatabaseModule }    from 'angularfire2/database';
import { AngularFireAuthModule }        from 'angularfire2/auth';

import { AuthGuard }                    from './auth-guard'
import { FirebaseSearchService }        from "./firebase-search.service";
import { LocalDataFactoryProvider }     from "./firebase-data-factory";

import { FirebaseService } 	            from './firebase.service';
import { environment }                  from '../../environments/environment';

@NgModule({
    imports: [ CommonModule,
        AngularFireModule.initializeApp(environment.firebaseConfig),
        AngularFireDatabaseModule,
        AngularFireAuthModule
    ],
    providers: [ AuthGuard, FirebaseService, FirebaseSearchService, LocalDataFactoryProvider ]
})
export class FirebaseModule { }
