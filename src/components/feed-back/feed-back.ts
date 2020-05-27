import { Component, Input } from '@angular/core';
import { NavParams, ViewController, AlertController, ToastController } from 'ionic-angular';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';

/**
 * Generated class for the FeedBackComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'feed-back',
  templateUrl: 'feed-back.html'
})
export class FeedBackComponent {
  // @Input() Wodata: any;
  // @Input() Type: any;
  // @Input() loggedEmp: any;

  woListPack:any;
  feedBackArray:any=[];
  feedBackTxt:string;
  loggedEmp:any;
  constructor(public navParams: NavParams, public OdsSvc: OdsServiceProvider, public ViewCtrl: ViewController, public alertController: AlertController, public toastController: ToastController, public loadcntrl: LoadingServiceProvider) {
    this.woListPack = this.navParams.get('workOrderObj');
    this.loggedEmp = this.navParams.get('logged');
    console.log(this.woListPack.WOID);
    this.getWoFeedBack(this.woListPack.WOID)

  }

  getWoFeedBack(id){
    let SearchString = '';
    SearchString =`<Info>
    <woid>${id}</woid></Info>`
    this.loadcntrl.presentLoadingCustom();
    this.OdsSvc.getFeedBackInfo(SearchString).subscribe(response=>{
      this.loadcntrl.hideloader();
      if (response.status === 200) {
        let body = JSON.parse(response._body);
        let result = JSON.parse(body[0].result);
        this.feedBackArray =result[0].WOFEEDBACK
          console.log('fb', this.feedBackArray);
        
      }
             
             
    },err=>{
      this.loadcntrl.hideloader();
    })
    
  }
 show:boolean;
 hide=true;
  addFeedBackForm(){
    this.show = true;
    this.feedBackTxt = '';
    this.hide = false;
  }
  Cancel(){
    this.show = false;
  }
  Close(){
    this.ViewCtrl.dismiss();
  }
  saveFeedBack() {
    console.log(this.feedBackTxt);

    if (this.feedBackTxt != null && this.feedBackTxt != "" && this.feedBackTxt != undefined) {
      let id = this.woListPack.WOID;
      let SearchString = '';
      SearchString = `<Info>
    <eid>${this.loggedEmp}</eid>
    <woid>${id}</woid>
    <feed>${this.feedBackTxt}</feed>
    </Info>`
      this.loadcntrl.presentLoadingCustom();
      this.OdsSvc.saveFeedBackInfo(SearchString).subscribe(res => {
        console.log(res);
        this.loadcntrl.hideloader();
        let body = JSON.parse(res._body);
        if (body[0].errorId > 0) {
          this.show = false;
          this.toastController.create({
            message: `Feedback added successfully.`,
            duration: 3000
          }).present();
          this.getWoFeedBack(id);
        }

      }, err => {
        this.loadcntrl.hideloader();
        this.show = false;
      })
    } else {
      const alert = this.alertController.create({
        message: 'Enter your FeedBack.',
        buttons: ['OK']
      });
      alert.present();
    }

  }

}
