import * as wjcCore from 'wijmo/wijmo';

// Angular
import { Component, EventEmitter, Inject, ViewChild, enableProdMode, Input, AfterViewInit, ElementRef, NgModule, NgZone } from '@angular/core';
import { ComponentFactoryResolver, OnDestroy } from '@angular/core';

import { ModuleWithProviders }      from '@angular/core';
import { BrowserModule }            from '@angular/platform-browser';
import { CommonModule }             from '@angular/common';
import { platformBrowserDynamic }   from '@angular/platform-browser-dynamic';
import { Router, ActivatedRoute }   from '@angular/router';
import { WjInputModule }            from 'wijmo/wijmo.angular2.input';
// import { DataSvc }                  from './services/DataSvc';
import { TitleService }             from '../title.service';

import { AdDirective } from './ad.directive';
import { AdItem }      from './ad-item';
import { AdComponent } from './ad.component';
import { AdService }   from './ad.service';

'use strict';

@Component({
    templateUrl: './reports.component.html',
    styleUrls: [ './reports.component.css' ]
})

export class ReportsComponent implements AfterViewInit {

    reports: wjcCore.CollectionView;
    zoomLevels: wjcCore.CollectionView;
    viewsLoaded: number;
    @ViewChild('zoomEle') zoomEle: ElementRef;
    @ViewChild(AdDirective) adHost: AdDirective;

    ads: AdItem[];
    
    constructor(
        private titleService:TitleService, 
        @Inject(Router) private router: Router, 
        private route: ActivatedRoute, 
        @Inject(NgZone) private ngZone: NgZone, 
        private componentFactoryResolver: ComponentFactoryResolver, 
        private adService: AdService
    ) {
        this.titleService.selector = 'reports';

        // report list
        this.reports = new wjcCore.CollectionView([
            { header: 'Alphabetical List of Members', name: 'alphabeticalListOfMembers' },
            { header: 'Members by Member Type', name: 'membersByMemberType' },
            { header: 'Member Labels', name: 'memberLabels' },
        ], {
            currentChanged: (s, e) => {
                 this.loadComponent(s.currentItem.name);
           }
        });

        // zoom levels
        this.zoomLevels = new wjcCore.CollectionView([
            { header: '25%', value: 0.25 },
            { header: '50%', value: 0.5 },
            { header: '75%', value: 0.75 },
            { header: '100%', value: 1 },
            { header: '125%', value: 1.25 }
        ], {
             currentChanged: (s, e)=> {
                 //var view = <HTMLElement>document.querySelector('.zoom');
                 var view = this.zoomEle.nativeElement;
                 if (view) {                     
                     view.style.zoom = s.currentItem.value;
                 }                 
              }
         });

         this.ads = this.adService.getAds();
    }

    ngAfterViewInit() {
        this.zoomLevels.moveCurrentToPosition(2);
        this.loadComponent('alphabeticalListOfMembers');        
    }

    // commands
    print() {
        
        // create document
        var doc = new wjcCore.PrintDocument({
            title: this.reports.currentItem.header
        });

        // add content to it
        //var view = <HTMLElement>document.querySelector('.zoom')
        var view = this.zoomEle.nativeElement;
        for (var i = 0; i < view.children.length; i++) {
            doc.append(view.children[i]);
        }
        // and print it
        doc.print();
        // work around the "More tasks executed then were scheduled." exception
        //this.ngZone.runOutsideAngular(() => doc.print());
    }

    loadComponent(reportName:string) {
        setTimeout( () => {
            let adItem = this.ads.find(n => n.data.name == reportName);
            let componentFactory = this.componentFactoryResolver.resolveComponentFactory(adItem.component);
            let viewContainerRef = this.adHost.viewContainerRef;
            viewContainerRef.clear();
            let componentRef = viewContainerRef.createComponent(componentFactory);
            (<AdComponent>componentRef.instance).data = adItem.data;
        });
    }
}
