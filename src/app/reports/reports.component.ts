import { Component, ViewChild, AfterViewInit, ElementRef, NgZone, ComponentRef } from '@angular/core';
import { ComponentFactoryResolver } from '@angular/core';
import { TitleService }             from '../title.service';

import { AdDirective } from './ad.directive';
import { AdItem }      from './ad-item';
import { AdComponent } from './ad.component';
import { AdService }   from './ad.service';

import * as wjcCore from '@grapecity/wijmo';
import { environment } from '../../environments/environment';


@Component({
    templateUrl: './reports.component.html',
    styleUrls: [ './reports.component.css' ]
})

export class ReportsComponent implements AfterViewInit {

    reports: wjcCore.CollectionView;
    zoomLevels: wjcCore.CollectionView;
    viewsLoaded: number;
    componentRef: ComponentRef<any>;
    reportOptions: boolean;

    @ViewChild('zoomEle') zoomEle: ElementRef;
    @ViewChild(AdDirective) adHost: AdDirective;

    ads: AdItem[];
    
    constructor(
        private titleService:TitleService, 
        // @Inject(Router) private router: Router, 
        // private route: ActivatedRoute, 
        // @Inject(NgZone) private ngZone: NgZone, 
        private componentFactoryResolver: ComponentFactoryResolver, 
        private adService: AdService
    ) {
        wjcCore.setLicenseKey(environment.wijmoDistributionKey);
        this.titleService.selector = 'reports';

        // report list
        this.reports = new wjcCore.CollectionView([
            { header: 'Select Report ...', name: 'select' },
            { header: 'Active Members by Member Type', name: 'activeMembersByMemberType' },
            { header: 'Alphabetical List of Members', name: 'alphabeticalListOfMembers' },
            { header: 'Annual Membership', name: 'AnnualMembership' },
            { header: 'Cash Receipts Distribution History', name: 'cashReceiptsDistributionHistory' },
            { header: 'Cash Receipts Distribution Summary', name: 'cashReceiptsDistributionSummary' },
            { header: 'Members by Member Type', name: 'membersByMemberType' },
            { header: 'Member Labels', name: 'memberLabels' },
        ], {
            currentChanged: (s, e) => {
                if (s.currentItem.name != 'select') {
                    this.loadComponent(s.currentItem.name);
                }
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
         this.reportOptions = false;
    }

    ngAfterViewInit() {
        this.zoomLevels.moveCurrentToPosition(3);
        // this.loadComponent('activeMembersByMemberType');        
    }

    // commands
    print() {
        
        // create document
        const doc = new wjcCore.PrintDocument({
            title: this.reports.currentItem.header
        });

        // add content to it
        const view = this.zoomEle.nativeElement;
        for (var i = 0; i < view.children.length; i++) {
            doc.append(view.children[i]);
        }
        // and print it
        doc.print();
    }

    loadComponent(reportName:string) {
        setTimeout( () => {
            let adItem = this.ads.find(n => n.data.name == reportName);
            let componentFactory = this.componentFactoryResolver.resolveComponentFactory(adItem.component);
            let viewContainerRef = this.adHost.viewContainerRef;
            viewContainerRef.clear();
            let componentRef = viewContainerRef.createComponent(componentFactory);
            (<AdComponent>componentRef.instance).data = adItem.data;
            this.componentRef = componentRef;
            this.reportOptions = (componentRef.instance.reportOptions ? true: false); 
        });
    }

    changeReportOptions() {
        this.componentRef.instance.setReportOptions();
    }
}
