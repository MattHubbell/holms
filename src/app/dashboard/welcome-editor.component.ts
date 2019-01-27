import { Component, OnInit, OnDestroy } from '@angular/core';

import { TitleService }      from '../title.service';
import { Editor }            from './editor.model';
import { EditorService }     from './editor.service';
import { environment }       from '../../environments/environment';
import { Subscription }      from 'rxjs';

@Component({
  selector: 'welcome-editor',
  templateUrl: './welcome-editor.component.html',
  styleUrls: [ './welcome-editor.component.css' ]
})
export class WelcomeEditorComponent implements OnInit, OnDestroy {
  model: Editor;
  isNewItem: boolean;
  selectedItem: any;
  subscription: Subscription;
  options = environment.froalaOptions;

  constructor(
    private titleService: TitleService, 
    private editorService: EditorService 
  ) {
    this.model = new Editor();
    this.isNewItem = true;
    this.editorService.getItem();
    this.subscription = this.selectedItem =this.editorService.item.subscribe(x => {
      this.selectedItem = x;
      this.model = Editor.clone(this.selectedItem);
      this.isNewItem = false;
      });
    this.titleService.selector = 'welcome-editor';
  }

  ngOnInit() {
    this.resetForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  resetForm() {
  }

  onSubmit() {
    let model:Editor = new Editor(this.model.welcomeContent); 
    if (this.isNewItem) {
        this.editorService.addItem(model);
    } else {
        this.editorService.updateItem(this.model);
    }
  }
}
