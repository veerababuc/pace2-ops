import { Component, Input } from '@angular/core';
import { ViewController, ToastController, AlertController } from 'ionic-angular';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import moment from 'moment';
import { DatabaseProvider } from '../../providers/database/database';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';


/**
 * Generated class for the WorkordereditComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */

@Component({
  selector: 'workorderedit',
  templateUrl: 'workorderedit.html'
})
export class WorkordereditComponent {

  @Input() action: string;
  @Input() workOrderObj: any;
  readOnly: any;
  addparts: any = [];
  partObj: any = {
    part: null,
    price: null,
    note: null
  }
  stock_length: any = 0;
  stockcount_db: any = "";
  constructor(public viewController: ViewController,
    public odsService: OdsServiceProvider,
    private toastCtrl: ToastController,
    public db: DatabaseProvider,
    public alertController: AlertController,
    private loadingSrv: LoadingServiceProvider,
    public appconst: PaceEnvironment) {
    console.log('Hello WorkordereditComponent Component');
    this.db.getAllUsers().then(emdata => {
      console.log('emdata', emdata);
      this.stockcount_db = emdata[0].StockCount;
      if (emdata[0].SiteID != "0" && emdata[0].SiteID != "") {
        this.stock_length = (this.stockcount_db != 0) ? this.stockcount_db : 10;
      }
    });

  }

  cancel() {
    this.viewController.dismiss();
  }

  ngOnInit() {
    console.log('workOrderObj', this.workOrderObj);
    this.readOnly = this.workOrderObj.VINID;
    this.workOrderObj.VINID=this.workOrderObj.VINID.toUpperCase();
    this.workOrderObj.STOCKID=this.workOrderObj.STOCKID.toUpperCase();
  }

  isReadonly() {
    return this.readOnly != '' ? true : false;
  }

  updateWO() {
    let loader = this.loadingSrv.createLoader({ content: 'Updating ...' });
    loader.present();
    let searchOptions: string = `<Info><woid>${this.workOrderObj.WOID}</woid><vin>${this.workOrderObj.VINID}</vin><stock>${this.workOrderObj.STOCKID}</stock><ro>${this.workOrderObj.RO}</ro><po>${this.workOrderObj.PO}</po></Info>`
    this.odsService.updateWorkOrderVechileInfo(searchOptions).subscribe(Response => {
      //console.log('update workorder', Response);
      loader.dismiss();
      if (Response.status === 200) {
        let body = JSON.parse(Response._body);
        if (body[0].status == "0") {

          // setTimeout(() => {
          let wo = {
            woorder: this.workOrderObj,
            status: Response.status
          }
          this.viewController.dismiss(wo);
          // }, 1500)
          this.presentToast('Work order details updated successfully');
        } else {
          //this.presentToast('Try again');
        }
        //console.log('update workorder body', body);
      } else {
        //this.presentToast('Try again');
      }
    }, (err) => {
      loader.dismiss();
      //this.presentToast('Try again');
    });
  }

  presentToast(mgs) {
    let toast = this.toastCtrl.create({
      message: mgs,
      duration: 1500,
      position: 'bottom'
    });

    toast.onDidDismiss(() => {

    });

    toast.present();
  }

  keyup($event, type) {
    this.workOrderObj[type] = this.workOrderObj[type].toString().toUpperCase();
  }

  voidWorkOrders() {
    let loader = this.loadingSrv.createLoader();
    loader.present();
    let self = this;
    this.db.getAllUsers().then(emdata => {
      let searchOptions: string = `<Info><woid>${self.workOrderObj.WOID}</woid><eid>${emdata[0].EmpId}</eid><logtype>${emdata[0].LogType}</logtype><date>${moment(new Date()).format('MM/DD/YYYY HH:mm A')}</date></Info>`;
      self.odsService.voidWorkOrders(searchOptions).subscribe(Response => {
        loader.dismiss();
        if (Response.status === 200) {
          let body = JSON.parse(Response._body);
          if (body[0].errorId == "0") {
            let wo = {
              woorder: self.workOrderObj,
              status: Response.status
            }
            self.viewController.dismiss(wo);
            //console.log('hi');
            
            self.presentToast('Work order details deleted successfully');
          } else {
            self.presentToast('Try again');
          }
        } else {
          self.presentToast('Try again');
        }
      }, (err) => {
        loader.dismiss();
        self.presentToast('Try again');
      });
    });


  }

  addParts() {
    if (this.partObj.part != null && this.partObj.price != null) {
      this.addparts.push(Object.assign({}, this.partObj));
      this.clear();
      
    } else {
      const alert = this.alertController.create({
        message: 'Enter Part Name and Price.',
        buttons: ['OK']
      });
      alert.present();
    }
  }
  addPartsToSave(){
    if (this.partObj.part != null && this.partObj.price != null) {
      this.addparts.push(Object.assign({}, this.partObj));
      this.clear();
    }
  }

  remove(i) {
    this.addparts.splice(i, 1);
  }

  clear() {
    this.partObj = {
      part: null,
      price: null,
      note: null
    }
  }
  
  save() {
   this.addPartsToSave();
    //this.addparts.push(Object.assign({}, this.partObj));
      if(this.addparts.length > 0){
        
      const confirm = this.alertController.create({
        title: 'Please confirm',
        message: 'Are you sure you want to Add Parts?',
        buttons: [
          {
            text: 'Cancel',
            handler: () => {
              console.log('Disagree clicked');
            }
          },
          {
            text: 'Ok',
            handler: () => {
              this.saveAddParts();
            }
          }
        ]
      });
      confirm.present();
    }
    
    
  }
      
 saveAddParts(){
    
      let loader = this.loadingSrv.createLoader();
      loader.present();
      let self = this;
      this.db.getAllUsers().then(emdata => {
        let woinfo = `<Info><woid>${self.workOrderObj.WOID}</woid><date>${moment(new Date()).format('MM/DD/YYYY HH:mm a')}</date><siteid>${emdata[0].SiteNumber}</siteid><ipaddress>${this.appconst.ipAddress}</ipaddress><eid>${emdata[0].EmpId}</eid><logtype>${emdata[0].LogType}</logtype></Info>`
        let woparts = '';
        this.addparts.forEach(element => {
          if(element.note == null){
            element.note = '';
          }
          woparts += `<Info><name>${element.part}</name><price>${element.price}</price><notes>${element.note}</notes></Info>`
        });
        self.odsService.addPartstoWO(woinfo, woparts).subscribe(Response => {
          loader.dismiss();
          if (Response.status === 200) {
            let body = JSON.parse(Response._body);
            if (body[0].errorId == "0") {
              let wo = {
                woorder: self.workOrderObj,
                status: Response.status
              }
              self.viewController.dismiss(wo);
              self.presentToast('Work order details updated successfully');
            } else {
              self.presentToast('Try again');
            }
            console.log('update workorder body', body);
          } else {
            self.presentToast('Try again');
          }
        }, (err) => {
          loader.dismiss();
          self.presentToast('Try again');
        });
      });
    
    // } else {
    //   const alert = this.alertController.create({
    //     message: 'Please add at least one part',
    //     buttons: ['OK']
    //   });
    //   alert.present();
    // }

  }

  maxVin(event) {

    let newValue = event.value;

    let regExp = new RegExp('^[A-Za-z0-9]+$');

    if (!regExp.test(newValue)) {

      event.value = newValue.slice(0, -1);

    }
    if (event.value.length > 17)
      event.value = event.value.substring(0, 17)
  }
  maxStock(event) {

    let newValue = event.value;
    let regExp = new RegExp('^[A-Za-z0-9]+$');

    if (!regExp.test(newValue)) {

      event.value = newValue.slice(0, -1);

    }
    if (event.value.length > this.stock_length)
      event.value = event.value.substring(0, this.stock_length)
  }
  FillStock() {
    // this.isScan = "N";
    if (this.workOrderObj.VINID.length >= 17) {
      this.workOrderObj.STOCKID = this.workOrderObj.VINID.substring(this.workOrderObj.VINID.length - this.stock_length);
    }
    else
      this.workOrderObj.STOCKID = "";
  }
}
