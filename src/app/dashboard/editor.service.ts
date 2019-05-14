import { Injectable } from '@angular/core';
import { FirebaseService } from '../firebase';
import { Editor } from './editor.model';

@Injectable()
export class EditorService {

    item: any;
    
    constructor(private fs: FirebaseService) {}

    getItem() {
        this.item = this.fs.getItem(Editor.TableName());
    }

    addItem(model: Editor) { 
        let data = Editor.setData(model);
        this.fs.addObject(Editor.TableName(), data);
    }
    
    updateItem(model: Editor) {
        let data = Editor.setData(model);
        this.fs.updateObject(Editor.TableName(), data);
    }
}