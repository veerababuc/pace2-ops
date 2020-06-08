import { Component, Input } from '@angular/core';
import { ViewController, ToastController, AlertController } from 'ionic-angular';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import moment from 'moment';
import { DatabaseProvider } from '../../providers/database/database';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';

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
  
  isScan:any;

  options: BarcodeScannerOptions;
  scannedData: any = {};

  constructor(public scanner: BarcodeScanner,
    public viewController: ViewController,
    public odsService: OdsServiceProvider,
    private toastCtrl: ToastController,
    public db: DatabaseProvider,
    public alertController: AlertController,
    private loadingSrv: LoadingServiceProvider,
    public appconst: PaceEnvironment
    ) {
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
    console.log("Tot Obj :",this.workOrderObj);
    
    this.updateVinOrStock();
  }

  updateVinOrStock(){
    //if (this.workOrderObj.VINID != "") {
      if(this.workOrderObj.VINID != "" && this.workOrderObj.VINID.length <= 16) {
        this.appconst.ShowAlert("Enter valid Vin Number");
      }
      else if(this.workOrderObj.VINID != "" && this.workOrderObj.VINID.length > 17) {
        this.appconst.ShowAlert("VIN characters should not be more than 17");
      }else if((this.workOrderObj.VINID.length == 17 || this.workOrderObj.VINID.length == '') && this.workOrderObj.STOCKID != ""){

        let loader = this.loadingSrv.createLoader({ content: 'Updating ...' });
        loader.present();

        let searchOptions: string = `<Info><woid>${this.workOrderObj.WOID}</woid><vin>${this.workOrderObj.VINID}</vin><stock>${this.workOrderObj.STOCKID}</stock><ro>${this.workOrderObj.RO}</ro><po>${this.workOrderObj.PO}</po></Info>`
        console.log("Submit XML :" + searchOptions);
        this.odsService.updateWorkOrderVechileInfo(searchOptions).subscribe(Response => {
          console.log('update workorder', Response);
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
    //}
  }

  // updateWO() {

  //   if (this.workOrderObj.VINID == "" && this.workOrderObj.STOCKID == "") {
  //     this.appconst.addErrorMessage("Enter VIN or STOCK");
  //   }
  //   if (this.workOrderObj.VINID != "") {
  //     if (this.workOrderObj.VINID.length <= 16) {
  //       this.appconst.addErrorMessage("Enter valid Vin Number");
  //     }
  //     else if (this.isScan == "N") {
  //       if (this.workOrderObj.VINID.length > 17) {
  //         this.appconst.addErrorMessage("VIN characters should not be more than 17");
  //       }
  //     }
  //   }
  //   if (this.appconst.displayErrors() == true) {
  //     let reqObj: any = {
  //       "WONumber": this.workOrderObj.workOrderNumber,
  //       "WOVinNumber": this.workOrderObj.VINID.trim().toUpperCase(),
  //       "WOStockId": this.workOrderObj.STOCKID.trim().toUpperCase(),
  //       "WOROId": this.workOrderObj.RO,
  //       "WOPOId": this.workOrderObj.PO,
  //       "WODate": this.workOrderObj.workOrderRequestDate,
  //       "WOTime": this.workOrderObj.workOrderRequestTime,
  //       "WODueTime": this.workOrderObj.workOrderRequestTimeDue,
  //       "WORequestedBy": this.workOrderObj.workOrderRequestedId,
  //       "WOCreatedDate": this.workOrderObj.workOrderCreatedDate,
  //       "WOIPAddress": this.db.ipAddress,
  //     };
  //     this.appconst.startLoading();
  //     this.odsService.UpdateWorkOrder(reqObj).subscribe(Response => {
  //       this.appconst.stopLoading();
  //       console.log('update workorder', Response);
  //       // loader.dismiss();

  //       var val = Response.json();
  //       if (val.toLowerCase().indexOf("sucess") >= 0) {
  //         console.log("success");
  //         // setTimeout(() => {
  //         let wo = {
  //           woorder: this.workOrderObj,
  //           status: Response.status
  //         }
  //         // this.viewController.dismiss(wo);
  //         // }, 1500)
  //         this.appconst.ShowAlert('Work Order Updated Successfully');
  //         this.viewController.dismiss("SuccessfullyUpdated");
  //         //this.refreshdata("1");
  //         // this.navCtrl.setRoot('home-page');
  //       } else {
  //         //this.presentToast('Try again');
  //       }
  //       //console.log('update workorder body', body);
  //     },
  //       (err) => {
  //         //this.presentToast('Try again');
  //       });
  //   }
  // }

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
      //console.log(this.partObj.price);
      let alertMsg=this.partObj.part==null?'Enter part name':this.partObj.price==null?"Enter part price":"";
      const alert = this.alertController.create({
        message: alertMsg,
        buttons: ['OK']
      });
      alert.present();
    }
  }
  addPartsToSave(){
    if (this.partObj.part != null || this.partObj.price != null) {
      if (this.partObj.part != null && this.partObj.price != null) {
        this.addparts.push(Object.assign({}, this.partObj));
        this.clear();
      }else{
        let alertMsg = this.partObj.part == null ? 'Enter part name' : this.partObj.price == null ? "Enter part price" : "";
        const alert = this.alertController.create({
          message: alertMsg,
          buttons: ['OK']
        });
        alert.present();
      }
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
    //if(this.partObj.price != null  && this.partObj.part != null){
   this.addPartsToSave();
    //this.addparts.push(Object.assign({}, this.partObj));
    console.log(this.addparts);
    
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



  scan() {
    // this.vin = "";
    // this.stock = "";
    this.options = {
      prompt: "Place a barcode inside the viewfinder rectangle to scan it",
      orientation: "landscape",
    }

    this.scanner.scan(this.options).then((data) => {

      if (data.text.length > 18) {
       this.workOrderObj.VINID = data.text.substring(1, data.text.length);
      }
      else if (data.text.length == 17) {
       this.workOrderObj.VINID = data.text.trim();
        if (this.workOrderObj.STOCKID.trim() == "") {
          this.workOrderObj.STOCKID =this.workOrderObj.VINID.substring(17 - this.stock_length);
        }
        this.isScan = "Y";
        //this.openVinInfoPage(data.text.trim());
      }
      else if (data.text.length == 18) {
       this.workOrderObj.VINID = data.text.trim();
       this.workOrderObj.VINID = data.text.substring(1, data.text.length);
        if (this.workOrderObj.STOCKID.trim() == "") {
          this.workOrderObj.STOCKID =this.workOrderObj.VINID.substring(data.text.length - this.stock_length);
        }
        this.isScan = "Y";
        //this.openVinInfoPage(data.text.trim());
      } else if (data.cancelled == true) {
        this.odsService.setValue(false);
      }
      else {
       this.workOrderObj.VINID = data.text.trim();
        if (this.workOrderObj.STOCKID.trim() == "") {
          this.workOrderObj.STOCKID =this.workOrderObj.VINID.substring(data.text.length - this.stock_length);
        }
        this.isScan = "Y";
      }
    }, (err) => {
      console.log("Error:", err);
    });
  }
}
