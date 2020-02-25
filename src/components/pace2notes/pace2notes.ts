import { Component, Input } from '@angular/core';
import { ViewController ,ToastController,ToastOptions, AlertController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import moment from 'moment';
/**
 * Generated class for the Pace2notesComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pace2notes',
  templateUrl: 'pace2notes.html'
})
export class Pace2notesComponent {
 // @Input() workid: any;
  @Input() Wodata: any;
  @Input() NoteType: any;
  @Input() SId: any;
  show: boolean;
  Notes: any;
  Result: any;
  NotesData: any =[];
  EmpId: any;
  LogType: any;
  date: any;
  time: any;
  flag:any=0;
  body: any;
  WonId: any;
  Wosid: any;
  wwoid: any;
  Empname: any;
  notdata:any;
  hide = true;
  tostoptions: ToastOptions;
  ActualTime:any;
  Notess:any=[];
  wossid:any;
  wsi:any;
  workid:any;
  DataNotes =[];
  openload=0;
 
  constructor(public alertcontroller: AlertController, private tostcntrl: ToastController,private appconst: PaceEnvironment, private db: DatabaseProvider, public ViewCtrl: ViewController, public OdsService: OdsServiceProvider) {


  }
  ngOnInit() {
    console.log('in notes component....', this.workid,this.Wodata,this.NoteType);
    this.show = false;
    this.db.getAllUsers().then(emdata => {
      this.EmpId = emdata[0].EmpId;
      this.Empname = emdata[0].Empname;
      this.LogType = emdata[0].LogType;
      console.log('emp login id.....', emdata);
      
      this.GetwoData();
    });
   
  }
  GetwoData() {
   
    //this.NotesData = this.Wodata.WONOTES;
   this.Wosid = this.Wodata.WOSID;
    let self = this;
    console.log('all data....',this.LogType,this.Wodata.SUBWORKORDER.length,this.NoteType);
    if(this.LogType == 'C' && this.Wodata.SUBWORKORDER.length != 0 && this.NoteType == 'S'){
    console.log('in if.....');
    if(this.SId == 0){
      self.Wodata.SUBWORKORDER.forEach(element => {
        element.WOSERVICES.forEach(ele => {
          self.wossid = ele.WOSID;
         
        });
        self.workid = element.WOID;
        console.log('sub work wosid...',self.workid);
      });
      self.wsi = self.wossid;
      console.log('wsi..if.', self.wsi);
      this.GetOrders(this.workid,self.wsi,this.NoteType);
    }
    else {
      self.workid = this.Wodata.WOID;
      self.wsi = this.SId;
      this.GetOrders(this.workid,self.wsi,this.NoteType);
    }
    
    
    
      // if(this.NotesData.length == 0){
      //   this.hide = true;
      // }else{
      //   this.hide = false;
      // }
  }else{
    self.wsi = 0;
    this.workid = this.Wodata.WOID;
    console.log('wsi..else.', self.wsi);
    this.GetOrders(this.workid,self.wsi,this.NoteType);
    
    // if(this.NotesData.length == 0){
    //   this.hide = true;
    // }else{
    //   this.hide = false;
    // }
  }
    
    // if(this.NotesData.length == 0){
    //   this.hide = true;
    // }else{
    //   if(this.NoteType == 'W'){
    //     this.NotesData.forEach(element => {
    //       if(element.TYPE == 'W'){
    //         let wtype = [];
    //         wtype.push(element);
    //         console.log('W...wtype...', wtype);
    //         if(wtype.length == 0){
    //           console.log('W...true...', wtype);
    //           this.hide = true;
    //         }else{
    //           this.hide = false;
    //         }
    //       }
    //     });
    //   }else if(this.NoteType == 'S'){
    //     this.NotesData.forEach(element => {
    //       if(element.TYPE == 'S'){
    //         let wtype = [];
    //         wtype.push(element);
    //         console.log('S...wtype...', wtype);
    //         if(wtype.length == 0){
    //           console.log('S...true...', wtype);
    //           this.hide = true;
    //         }else{
    //           this.hide = false;
    //         }
    //       }
    //     });
    //   }else{
    //     this.hide = false;
    //   }
    // }
  }
  GetOrders(wkid,swid,typ) {
    console.log('pace2notes. retriveworkenotes..',wkid,swid);
    this.appconst.startLoading();
    this.OdsService.GetRetriveWorkOrderNotes(wkid, swid,typ).subscribe(data => {
      this.appconst.stopLoading();
      this.Result = JSON.parse(data[0].result);
      console.log('result get notes data', this.Result[0].NOTES);
      if(this.Result[0].NOTES.length > 0){
        this.NotesData = this.Result[0].NOTES;
        console.log('datanotes....', this.NotesData);
       //this.hide = false;
      }
     
        else{
          //this.hide = true;
          this.NotesData='No Data Found';
        }
    })
    
  }
  Close() {
    console.log('close.....',this.NotesData);
    this.ViewCtrl.dismiss(this.openload);
  }
  AddNotes() {
    this.show = true;
    this.Notes = '';
    this.hide = false;
  }
  Cancel() {
    this.show = false;
  }
  Edit(itm, wonid) {
    console.log('edit...',itm,wonid)
    this.show = true;
    this.Notes = itm;
    this.flag = 1;
    this.WonId =  wonid;
  }

  Save() {
    
    if (this.flag == 1) {
      this.openload=1;
      this.flag = 0;
      this.date = moment(new Date()).format('MM.DD.YY');
      this.time = moment(new Date()).format('HH:mm A');
      this.ActualTime = moment(this.time, ["HH:mm"]).format("hh:mm A");
      console.log('date and time save...',this.date,this.time,this.ActualTime);
      this.body = {
        "strSearchString": `<Info><eid>${this.EmpId}</eid><logtype>${this.LogType}</logtype><serviceid>${this.wsi}</serviceid><date>${this.date.trim()}</date><time>${this.ActualTime.trim()}</time><ip>${this.appconst.ipAddress}</ip><type>${this.NoteType}</type><action>U</action><wonid>${this.WonId}</wonid><woid>${this.workid}</woid><notes>${this.Notes}</notes></Info>`

      }
    } else {
      this.flag = 0;
      this.openload=1;
      if (!this.Notes) {
        this.tostoptions = {
          message: "Note should not be Empty!",
          duration: 3000,
        }
        this.tostcntrl.create(this.tostoptions).present();
        return false;
      } else {
        this.date = moment(new Date()).format('MM.DD.YY');
    this.time = moment(new Date()).format('HH:mm A');
    this.ActualTime = moment(this.time, ["HH:mm"]).format("hh:mm A");
    console.log('date and time save...',this.date,this.time,this.ActualTime);
        this.body = {
          "strSearchString": `<Info><eid>${this.EmpId}</eid><logtype>${this.LogType}</logtype><serviceid>${this.wsi}</serviceid><date>${this.date.trim()}</date><time>${this.ActualTime.trim()}</time><ip>${this.appconst.ipAddress}</ip><type>${this.NoteType}</type><action>A</action><wonid>0</wonid><woid>${this.workid}</woid><notes>${this.Notes}</notes></Info>`
        }
      }
      this.notdata = {
        INSERTEDBY: this.EmpId,
        INSERTEDBYDATE: this.date + " " + this.ActualTime,
        INSERTEDBYNAME: this.Empname,
        ISEDITED: 'N',
        NOTES: this.Notes,
        TYPE: this.NoteType,
        WONID: 0,
        WONWOID: this.workid,
        WOSID:  this.wsi
      }
     // this.LogType == 'C'? this.wossid :
      //this.NotesData.push(data);
    }
   let self=this;
    this.OdsService.CreateWorkOrderNotes(this.body).subscribe((data) => {
      this.show = false;
      console.log('errid..',data);
      if (data[0].errorId == 1) {
        console.log('errid1..',self.NotesData);
        this.GetOrders(this.workid,self.wsi,this.NoteType);
         //self.NotesData.push(Object.assign({},self.notdata));
         console.log('erridnew..', self.NotesData);
       
      } else if (data[0].errorId == 2) {
        console.log('errid2..',this.NotesData);
        this.GetOrders(this.workid,self.wsi,this.NoteType);
        // this.NotesData.forEach(element => {
        //   if (element.WONID == this.WonId) {
        //     element.NOTES = this.Notes;
        //   }
        // });
      }
      //this.GetOrders();
    });
  }

  Delete(wonid,i) {
    this.openload=1;
    console.log('delete...',i,wonid);
    this.date = moment(new Date()).format('MM.DD.YY');
    this.time = moment(new Date()).format('HH:mm A');
    this.ActualTime = moment(this.time, ["HH:mm"]).format("hh:mm A");
    console.log('date and time delete...',this.date,this.time,this.ActualTime);
    let alert = this.alertcontroller.create({
      title: 'Do you want to Delete?',
      buttons: [{
        text: 'Ok',
        handler: () => {
          this.Notes = '';
          this.WonId = wonid;
          this.body = {
            "strSearchString": `<Info><eid>${this.EmpId}</eid><logtype>${this.LogType}</logtype><serviceid>${this.wsi}</serviceid><date>${this.date}</date><time>${this.ActualTime}</time><ip>${this.appconst.ipAddress}</ip><type>${this.NoteType}</type><action>D</action><wonid>${this.WonId}</wonid><woid>${this.workid}</woid><notes>${this.Notes}</notes></Info>`
          }
          this.OdsService.CreateWorkOrderNotes(this.body).subscribe((data) => {
            if (data[0].errorId == 3){
            console.log('delete data....', data);
            this.show = false;
            this.GetOrders(this.workid, this.wsi,this.NoteType);
            
            // if(this.NotesData.length == 0){
            //   this.hide = true;
            // }else{
            //   this.hide = false;
            // }
            //this.NotesData.splice(i,1);
            
            // if(this.NotesData.length == 0){
            //   this.hide = true;
            //  }
            //else{
            //   this.NotesData.forEach(element => {
            //     if(element.TYPE == this.NoteType){
            //       let wtype = [];
            //       wtype.push(element);
            //       console.log('D...wtype...', wtype);
            //       if(wtype.length == 0){
            //         console.log('D...true...', wtype);
            //         this.hide = true;
            //       }else{
            //         this.hide = false;
            //       }
            //     }
            //   });
            // }
          }
          });
        }
          
        
      }, {
        text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }

        }
        ]
      });
      alert.present();
}
}