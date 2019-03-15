import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from "rxjs";
import { MatSidenav }  from '@angular/material';

import { FirebaseService, FirebaseUser } from './firebase';
import { MembershipUserService, MembershipUser, MembershipUserType } from './admin/membership-users';
import { MemberService, Member } from "./members";
import { SetupService, Setup } from "./admin/setup";
import { AppMenu, AppMenuService } from './admin/app-menus';
import * as f from './shared/functions';

declare function require(moduleName: string): any;
const { version: appVersion } = require('../../package.json')

@Injectable()
export class AppService implements OnDestroy {
    public appVersion: string;
    public isLoggedOn: boolean;
    public isPastDue: boolean;
    public isAutoLogin: boolean;
    public isMemberChecked: boolean;
    public user: FirebaseUser;
    public membershipUser: MembershipUser;
    public setup: Setup;
    public sidenav: MatSidenav;
    public navMode: string;
    public appTitle: string;
    public appSubTitle: string;
    public userEmail: string;
    public profileImagePath: string;
    public profileName: string;
    public appMenuList: AppMenu[];
    public returnUrl: string;

    private memberSubscription: Subscription;
    private subscription: Array<Subscription>;

    constructor(
        private firebaseService: FirebaseService, 
        private membershipUserService: MembershipUserService, 
        private memberService: MemberService, 
        private setupService: SetupService,
        private appMenuService: AppMenuService,
        private router: Router
    ) {
        this.appVersion = appVersion;
        this.isLoggedOn = false;
        this.isAutoLogin = false;
        this.returnUrl = '';
        if (this.sidenav) {
            this.sidenav.close();
        }
        if (window.innerWidth > 768) {
            this.navMode = 'side';
        } else {
            this.navMode = 'over';
        }
        this.subscription = new Array<Subscription>();
        this.setupService.getItem();
        this.subscription.push(this.setupService.item.subscribe(x => {
            this.setup = x;
            this.appTitle = this.setup.appTitle;
            this.appSubTitle = this.setup.appSubTitle;
        }));
        this.user = new FirebaseUser();
        this.membershipUser = new MembershipUser();
        this.profileImagePath = 'assets/holms4.webp';
    }

    ngOnDestroy() {
        this.firebaseService.logout();
    }

    onSuccessfulSignIn() {
        if (this.firebaseService.authenticated) {
            if (this.sidenav) {
                if (window.innerWidth > 768) {
                    this.navMode = 'side';
                    this.sidenav.open();
                }
            }
            this.user = this.firebaseService.user;
            if (this.user.picture) {
                this.profileImagePath = this.user.picture;
            } else { 
                this.profileImagePath = 'assets/holms4.webp';
            }
            this.subscription.push(this.membershipUserService.getItemByKey(this.user.id).subscribe(x => {
                this.checkForMemberShipUser(x); 
            }));
        } else {
            this.isLoggedOn = false;
            this.sidenav.close();
            this.user = null;
            this.router.navigate(['']);
        }
    }
    
    checkForMemberShipUser(membershipUser: MembershipUser) {
        if (this.isLoggedOn) { return; }
        this.appMenuService.getList();
        this.subscription.push(this.appMenuService.list
            .subscribe(x => {
                this.profileName = this.firebaseService.user.name;
                if (this.profileName == undefined) {
                    this.firebaseService.updateProfile(f.camelCase(membershipUser.name));
                    this.profileName = f.camelCase(membershipUser.name);
                } 
                this.membershipUser.memberId = membershipUser.memberId;
                this.membershipUser.name = membershipUser.name;
                this.membershipUser.userType = membershipUser.userType;
                this.checkAppMenu(x);
                this.checkForNewMember(membershipUser);
            })
        );
        this.isLoggedOn = true;
    }

    checkForNewMember(membershipUser: MembershipUser) {
        if (membershipUser.userType == MembershipUserType.New) {
            this.navigateTo('/new-registration');
        } else {
            if (membershipUser.name) {
                this.memberSubscription = this.memberService.getItemByMemberID(membershipUser.memberId)
                    .subscribe((x: Member) => { 
                        this.checkForMembershipPastDue(x[0]); 
                    }
                );
            } else {
                this.navigateTo('/register');
            }
        }
    }

    checkForMembershipPastDue(member: Member) {
        if (this.isMemberChecked) { return; }
        this.isMemberChecked = true;
        if (member === undefined) {
            this.navigateTo('/new-member');
        } else {
            const currentDate: Date = new Date();
            const paidThruDate: Date = new Date(member.paidThruDate);
            if (member.lastDuesYear < this.setup.duesYear || paidThruDate < currentDate) {
                this.isPastDue = true;
                this.navigateTo('/membership-dues');
            } else {
                this.isPastDue = false;
                if (this.isAutoLogin && this.returnUrl != '' && this.returnUrl != '/login') {
                    this.navigateTo(this.returnUrl);
                } else {
                    this.navigateTo('/dashboard');
                }
            }
        }
    }

    checkAppMenu(appMenu: AppMenu[]) {
        let list = new Array<AppMenu>();
        for (let menuItem of appMenu) {
            if (menuItem.userTypes != undefined) {
                for (let type of menuItem.userTypes) {
                    if (type == this.membershipUser.userType.toString()) {
                        list.push(menuItem);
                    }
                }
            }
        }
        this.appMenuList = list;
      }

    navigateTo(destination: string) {
        console.log(destination);
        this.router.navigate([destination]);
    }
    
    onLogout() {
        this.isLoggedOn = false;
        this.isMemberChecked = false;
        this.isAutoLogin = false;
        if (this.sidenav) {
            this.sidenav.close();
        }
        this.subscription.forEach(x => x.unsubscribe());
        if (this.memberSubscription) {
            this.memberSubscription.unsubscribe();
        }
        this.user = new FirebaseUser();
        this.membershipUser = new MembershipUser();
        this.router.navigate([''])
    }
}
