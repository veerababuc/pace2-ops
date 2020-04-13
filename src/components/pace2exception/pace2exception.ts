import { Component,Input} from '@angular/core';
import { ViewController ,ModalController} from 'ionic-angular';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { DatabaseProvider } from '../../providers/database/database';
import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';

/**
 * Generated class for the Pace2exceptionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pace2exception',
  templateUrl: 'pace2exception.html'
})
export class Pace2exceptionComponent {
  @Input() workid:any;
  @Input() Depname:any;
  @Input() Depid:any;
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
  NoImg: string = "../../assets/imgs/workorderqueue/no-user-image.png";
  ImgUrl: any;
  constructor(public loadcntrl: LoadingServiceProvider, private db:DatabaseProvider, public modalctrl: ModalController,private appconst: PaceEnvironment, public ViewCtrl: ViewController, public OdsService: OdsServiceProvider) {
       
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
