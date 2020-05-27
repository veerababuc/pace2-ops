
import { Injectable } from '@angular/core';
import { LoadingController, LoadingOptions } from 'ionic-angular';

/*
  Generated class for the LoadingServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class LoadingServiceProvider {
  loading: any;
  constructor(public loadingCtrl: LoadingController) {
  }
  
  createLoader(options?: LoadingOptions) {
    if (options == undefined)
      options = {};
    let dftOptions: LoadingOptions = { duration: 1000 * 50, spinner: 'crescent', content: 'Please wait...' };
    Object.assign(dftOptions, options);
    options = dftOptions;
    return this.loadingCtrl.create(options);
  }
  presentLoadingCustom() {
    this.loading = this.loadingCtrl.create({
      //spinner: 'circles',
      content: `Loading...`,
    });
    this.loading.present();
  }
  hideloader() {
    this.loading.dismissAll();
  }

  showloader(mgs) {
    this.loading = this.loadingCtrl.create({
      //spinner: 'circles',
      content: mgs,
    });
    this.loading.present();
  }


}
