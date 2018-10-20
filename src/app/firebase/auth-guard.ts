import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { FirebaseService } from './firebase.service';
import { MatSidenav } from '@angular/material';
import { AppService } from '../app.service';

@Injectable()
export class AuthGuard implements CanActivate {

    navMode: String;
    sidenav: MatSidenav;

    constructor(
        private router: Router,
        private firebaseService:FirebaseService,
        private appService:AppService
    ) { 
        this.navMode = this.appService.navMode;
        this.sidenav = this.appService.sidenav;
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.navMode == 'over') {
            this.sidenav.close();
        }

        if (this.firebaseService.authenticated) {
            if (!this.appService.isLoggedOn) {
                return false;
            }
            if (this.firebaseService.currentUser) {
                // logged in so return true
                return true;
            }
        }

        // not logged in so redirect to the login page with the return url
        //this.router.navigate(['', { returnUrl: state.url }]);
        this.router.navigate(['']);
        return false;
    }
}