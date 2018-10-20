import { Injectable }           from '@angular/core';
import { AdItem }               from './ad-item';
import { CheckRegisterComponent }    from './check-register.component';
@Injectable()
export class AdService {
  getAds() {
    return [
      new AdItem( CheckRegisterComponent, { name: 'check-register' }),
    ];
  }
}
