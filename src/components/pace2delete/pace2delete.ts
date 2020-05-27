import { Component, Input } from '@angular/core';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { ViewController,ModalController,ToastController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';
import moment from 'moment';

/**
 * Generated class for the Pace2deleteComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pace2delete',
  templateUrl: 'pace2delete.html'
})
export class Pace2deleteComponent {
  @Input() workid:any;
  @Input() typeName:any;
  notes:any;
  Eid:any;
  LogType:any;
  constructor( public toastController: ToastController,public modalctrl:ModalController,public loadcntrl: LoadingServiceProvider,private appconst:PaceEnvironment,private db:DatabaseProvider,public OdsService: OdsServiceProvider,public ViewCtrl: ViewController) {
    console.log('Hello Pace2deleteComponent Component');
    
  }
  ngOnInit(){
    let self = this;
    this.db.getAllUsers().then(emdata=>{
        this.Eid = emdata[0].EmpId; 
      this.LogType = emdata[0].LogType; 
    })
    }
  Cancel(){
    this.ViewCtrl.dismiss();
  }
  VoidNotify(){
    if((this.notes == null) || (typeof(this.notes) == 'undefined') || this.notes == ""){
      this.toastController.create({
        message: `Enter Fix Notes.`,
        duration: 3000
      }).present();
    }else{
    let date = moment(new Date()).format('MM/DD/YYYY HH:mm');
    let woinfo:any;
    let wonotes :any;
    let woparts :any;
    let woservices:any;
woinfo = `<Info><woid>${this.workid}</woid><eid>${this.Eid}</eid><sdid>0</sdid><logtype>${this.LogType}</logtype><date>${date}</date><ip>${this.appconst.ipAddress}</ip><action>V</action></Info>`
wonotes = this.notes;
woparts= ""
woservices= ""

this.OdsService.DeleteworkOrderException(woinfo,wonotes,woparts,woservices).subscribe((data) => {
  console.log('delete work order exp...', data);
  this.ViewCtrl.dismiss("Success");
})
  }
}
OK(){
  if((this.notes == null) || (typeof(this.notes) == 'undefined') || this.notes == ""){
    this.toastController.create({
      message: `Enter Fix Notes.`,
      duration: 3000
    }).present();
  }else{
  let date = moment(new Date()).format('MM/DD/YYYY HH:mm');
  let woinfo:any;
  let wonotes :any;
 
woinfo = `<Info><woid>${this.workid}</woid><eid>${this.Eid}</eid><etype>${this.LogType}</etype><ip>${this.appconst.ipAddress}</ip><fixdate>${date}</fixdate></Info>`
wonotes = this.notes;
this.OdsService.FixExceptions(woinfo,wonotes).subscribe((data) => {
console.log('delete work order exp...', data);
this.ViewCtrl.dismiss("Success");
})
}
}
  AddServices(type){
    console.log('notessss.....', this.notes);
    if((this.notes == null) || (typeof(this.notes) == 'undefined') || this.notes == ""){
      this.toastController.create({
        message: `Enter Fix Notes.`,
        duration: 3000
      }).present();
  }else{
    let Modal = this.modalctrl.create('TestPage',{'type':type,'Data':this.workid ,'NotesData':this.notes},{ cssClass: "full-height-modal" });
    Modal.onDidDismiss(() => {
      console.log('in delete page');
      this.ViewCtrl.dismiss();
    });
    Modal.present();
  }
} 
}
