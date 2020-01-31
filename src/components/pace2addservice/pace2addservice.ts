import { Component, Input } from '@angular/core';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { ViewController,ToastController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';
import moment from 'moment';

/**
 * Generated class for the Pace2addserviceComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pace2addservice',
  templateUrl: 'pace2addservice.html'
})
export class Pace2addserviceComponent {
  Service:any;
 ServiceData :any;
 AllPacks:any= 0;
 Show:boolean;
 SitId:any;
 Eid:any;
 LogType:any;
 SIID:any=[];
 notes:any;
 SelectService:any =[];
 @Input() workid:any;
 @Input() Depname:any;
 @Input() Depid:any;
 @Input() FCID:any;
 selectPack:any = 0;
 //AddServiceData:any=[];
 AddServiceData:any[] = [];
 AddAllServiceData:any[] = [];
 DupIds:any = [];
  constructor(public toastController: ToastController,public loadcntrl: LoadingServiceProvider,private appconst:PaceEnvironment,private db:DatabaseProvider,public OdsService: OdsServiceProvider,public ViewCtrl: ViewController,) {
  
  }
  ngOnInit(){
    
    let self = this;
    this.db.getAllUsers().then(emdata=>{
      this.SitId = emdata[0].SiteNumber; 
      this.Eid = emdata[0].EmpId; 
      this.LogType = emdata[0].LogType; 
      console.log('from addservices.....',emdata,self.Depid,self.Depname,self.FCID,self.SitId);
      let packageOptions = {
        SiteId: emdata[0].SiteNumber,
        loggedInEmpId: emdata[0].EmpId,
        EmplogTypeCode: emdata[0].LogType
      }

      this.loadcntrl.presentLoadingCustom();
      self.OdsService.GetPackages(packageOptions).subscribe((data) => {
        self.Service = JSON.parse(data[0].result);
        self.ServiceData = this.Service[0].PACKAGES; 
        self.ServiceData.forEach(element => {
          element.selection = "--Select--";
          element.SITESERVICEDEPARTMENTS.forEach(ele => {
           if(ele.SDID == this.Depid) {
            this.AddServiceData.push({name:element.TITLE,value:element.SSIID,SERVICEITEMS:element.SERVICEITEMS});
            this.AddAllServiceData.push(element);
           }
          });
        });
        this.loadcntrl.hideloader();     
        console.log('getpacks data...', data,this.AddServiceData );    
       
      });
    });
  }
  
  Cancel() {
    this.ViewCtrl.dismiss();
  }
  Remove(idx){
    this.AddServiceData.push(this.SelectService[idx]);
    if(this.SelectService.length == 0){
    this.Show = false;
    }else{
    this.SelectService.splice(idx,1);
    
  }
  this.AllPacks = '--Select--';
  }
  onChange(itm){
    console.log(itm)
    if(itm != '0'){
    console.log('event selection,,,',itm);
      this.Show = true;
      //this.AllPacks=itm;
      let indx = this.AddServiceData.findIndex( item =>{
        console.log('index find...', itm);
       return item.value == itm; 
      });
      this.SelectService.push(this.AddServiceData[indx]);
      this.AddServiceData.splice(indx,1);
      console.log('inex.....', indx,this.SelectService,this.AddServiceData);
    }else{
      this.AllPacks = '0';
    }
  }
  Select_SSIID(itm) {
    console.log('selecion id ssiid', itm);
  }
  FixWo(){
    let selectedids = [];
    for(let s = 0; s <= this.SelectService.length-1; s++) {
      selectedids.push({"SSIID":this.SelectService[s].value})
    }
    const uids = [];
    const dids = [];
    const duids = [];
    if (selectedids.length > 0) {
      for (let i = 0; i < selectedids.length; i++) {
        const index = this.AddAllServiceData.findIndex(x => x.SSIID === Number(selectedids[i].SSIID));
        for (let j = 0; j < this.AddAllServiceData[index].SERVICEITEMS.length; j++) {
          const id = this.AddAllServiceData[index].SERVICEITEMS[j].SICODE;
          const sid = this.AddAllServiceData[index].SERVICEITEMS[j].SSIID;
          if (uids.filter(x => x.SICODE === id).length > 0) {
            // if (dids.filter(y => y.SICODE === id).length === 0) {
              dids.push({ SICODE: id});
              duids.push(sid);
            // }
          } else {
            uids.push({ SICODE: id });
          }
        }
      }
    }
    this.DupIds = duids.join(',');
    console.log(this.DupIds);
    if(dids.length > 0){
      this.toastController.create({
        message: `Selected Packages Have Duplicate Items.`,
        duration: 3000
      }).present();
    }
    else if((dids.length < 0) || (this.notes == null) || (typeof(this.notes) == 'undefined') || this.notes == ""){
      this.toastController.create({
        message: `Enter Fix Notes.`,
        duration: 3000
      }).present();
    }else{
    //let date = moment(new Date()).format('MM/DD/YYYY HH:mm');
    let date = moment(new Date()).format('MM/DD/YYYY hh:mm A');////changed by Vishnu
    let woinfo: any;
    let woservices: any = '';
    let wofixnotes: any = '';
    woinfo = `<Info>
    <woid>${this.workid}</woid>
    <siteid>3269</siteid>
    <eid>${this.Eid}</eid>
    <logtype>${this.LogType}</logtype>
    <ipaddress>${this.appconst.ipAddress}</ipaddress>
    <date>${date}</date>
    <deptid>${this.Depid}</deptid>
    <fixcat>${this.FCID}</fixcat>
    </Info> `
    this.SelectService.forEach(element => {
      woservices += `<Info><ssiid>${element.value}</ssiid></Info>`
    });
    ///console.log(this.SelectService);
    
    wofixnotes = this.notes;
    //console.log(woservices, "" ,woinfo);
    
    this.OdsService.GetFixDeliveryWoExceptions(woinfo, woservices, wofixnotes).subscribe((data) => {
      console.log('save work order exp...', data);
      this.ViewCtrl.dismiss("Success");
    })

  }
} 
    // GetFixDeliveryWoExceptions
}
