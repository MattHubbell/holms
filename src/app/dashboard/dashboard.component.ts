import { Component, OnInit, OnDestroy } from '@angular/core';
import { TitleService }      from '../title.service';
import { Editor }            from './editor.model';
import { EditorService }     from './editor.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: [ './dashboard.component.css' ]
})
export class DashboardComponent implements OnInit, OnDestroy {
    
    public editor: Editor;
    public welcomeContent: any;
    private subscription: Subscription;

    constructor(private titleService:TitleService, private editorService:EditorService) {
        this.titleService.selector = 'dashboard';
    }

    ngOnInit() {
        this.editorService.getItem();
        this.subscription = this.editorService.item.subscribe(x => {
            this.welcomeContent = (<Editor>x).welcomeContent;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}

