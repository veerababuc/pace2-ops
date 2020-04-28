import { Component,Input} from '@angular/core';
import { ViewController ,ModalController, IonicPage, NavParams} from 'ionic-angular';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { DatabaseProvider } from '../../providers/database/database';
import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';

/**
 * Generated class for the ExceptionFixPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name:'21'
})
@Component({
  selector: 'page-exception-fix',
  templateUrl: 'exception-fix.html',
})
export class ExceptionFixPage {
   workid:any;
   Depname:any;
   Depid:any;
   type:any;
  EmpId: any;
  ExpData: any;
  EmpList: any = [];
  ExceptionName: any;
  ExceptionNotes: any;
  ExceptionVin: any;
  ExceptionPack: any;
  ExceptionService: any;
  ExceptionWonum: any;
  ExceptionFixes: any = [];
  NoImg: string = "";
  ImgUrl: any;
  constructor(public loadcntrl: LoadingServiceProvider, 
    private navParams:NavParams,
    private db:DatabaseProvider, public modalctrl: ModalController,private appconst: PaceEnvironment, public ViewCtrl: ViewController, public OdsService: OdsServiceProvider) {
    this.type = this.navParams.get('type');
    this.workid = this.navParams.get('Data');
    this.Depname = this.navParams.get('DeptName');
   // this.wodid = this.navParams.get('WoDid');
    this.Depid=this.navParams.get('deptid');
  }
  ngOnInit(){
    console.log('workOrderId....', this.workid);
    this.db.getAllUsers().then(emdata=>{
        this.EmpId = emdata[0].EmpId;
        console.log('emp login id.....',emdata);
        this.loadcntrl.presentLoadingCustom();
        this.OdsService.GetWoExceptionwithEmployeeFix(this.workid,this.EmpId ).subscribe((data) => {
          console.log('api1 res....', data);
          this.ExpData = JSON.parse(data[0].result);
          if( this.ExpData[0].EXCEPTIONDETAILS.length > 0){
            this.loadcntrl.hideloader();
          console.log('expdata..', this.ExpData);
          if(this.ExpData[0].EXCEPTIONDETAILS.length != 0 ){
          this.ImgUrl = this.appconst.Paceimg + /profile/;
          this.EmpList = this.ExpData[0].EXCEPTIONDETAILS[0].EXCEPTIONFIXEMPLOYEES;
          if(this.ExpData[0].EXCEPTIONDETAILS[0].EXCEPTIONRULEDETAILS.length != 0){
          this.ExceptionName = this.ExpData[0].EXCEPTIONDETAILS[0].EXCEPTIONRULEDETAILS[0].NAME;
          this.ExceptionNotes = this.ExpData[0].EXCEPTIONDETAILS[0].EXCEPTIONRULEDETAILS[0].NOTES;
          }
          this.ExceptionVin = this.ExpData[0].EXCEPTIONDETAILS[0].VIN;
          this.ExceptionPack = this.ExpData[0].EXCEPTIONDETAILS[0].PACKAGENAME;
          this.ExceptionService = this.ExpData[0].EXCEPTIONDETAILS[0].SERVICEITEM;
          this.ExceptionWonum = this.ExpData[0].EXCEPTIONDETAILS[0].WONUM;
          this.ExceptionFixes = this.ExpData[0].EXCEPTIONDETAILS[0].EXCEPTIONRULEFIXES
          }
          }
          else{
            this.loadcntrl.hideloader();
          }
    
        });
     });
   
  }
  Cancel() {
    this.ViewCtrl.dismiss();
  }
  AddService(type,fcid){
    let Modal = this.modalctrl.create('TestPage',{'type':type ,'Data':this.workid,'DeptName':this.Depname,'DeptId':this.Depid,'FCID':fcid},{ cssClass: "full-height-modal" });
    Modal.onDidDismiss((data) => {
      if(typeof(data) != 'undefined'){
        this.ViewCtrl.dismiss(data);
      }
    }); 
    Modal.present();
  }
  Delete(type){
    let Modal = this.modalctrl.create('TestPage',{'type':type ,'Data':this.workid,},{ cssClass: "full-height-modal" });
    Modal.onDidDismiss((data) => {
      if(typeof(data) != 'undefined'){
      this.ViewCtrl.dismiss(data);
      }
    });
    Modal.present();
  }
  Process(type){
    let Modal = this.modalctrl.create('TestPage',{'type':type ,'Data':this.workid,},{ cssClass: "full-height-modal" });
    Modal.onDidDismiss((data) => {
      if(typeof(data) != 'undefined'){
      this.ViewCtrl.dismiss(data);
      }
    });
    Modal.present();
  
  }
}