import { Injectable } from '@angular/core';
import { FirebaseService } from '../../firebase';
import { Setup } from './setup.model';

@Injectable()
export class SetupService {

    item: any;
    
    constructor(private fs: FirebaseService) {}

    getItem() {
        this.item = this.fs.getItem(Setup.TableName());
    }

    addItem(model: Setup) { 
        let data = Setup.setData(model);
        this.fs.addObject(Setup.TableName(), data);
    }
    
    updateItem(model: Setup) {
        let data = Setup.setData(model);
        this.fs.updateObject(Setup.TableName(), data);
    }
}