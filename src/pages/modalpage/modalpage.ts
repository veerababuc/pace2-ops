import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';

/**
 * Generated class for the ModalpagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modalpage',
  templateUrl: 'modalpage.html',
})
export class ModalpagePage {
  workOrderObj: any;
  action:any;
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public viewController:ViewController) {
      console.log('ModalpagePage',this.navParams.get('workOrderObj'));
        this.workOrderObj = Object.assign({},this.navParams.get('workOrderObj'));
        this.action = this.navParams.get('action');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalpagePage',this.navParams.get('workOrderObj'));
   
  }

}
