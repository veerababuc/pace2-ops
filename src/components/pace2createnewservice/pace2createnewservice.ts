import { Component ,Input} from '@angular/core';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { ViewController,ModalController,ToastController } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';
import moment from 'moment';
import { ThrowStmt } from '@angular/compiler';

/**
 * Generated class for the Pace2createnewserviceComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pace2createnewservice',
  templateUrl: 'pace2createnewservice.html'
})
export class Pace2createnewserviceComponent {
  @Input() workid:any;
  @Input() NotesData:any;
  SitId:any;
  Eid:any;
  LogType:any;
  Service:any;
  ServiceData:any =[];
  ServiceOpen:boolean;
  addparts:boolean;
  // DataSearch:any;
  // searchdata:any;
  SelectService:any=[];
  Show:boolean = false;
  ischeck={
    isyes:false,
    isno:false
    }
    deptname:any;
    Departments:any=[];
    showservice:boolean =false;
    MainPackData:any=[];
    flag:any=1;
    partname:any;
    price:any;
    PartItems:any=[];
    hide:boolean = false;
    MainData:any =[];
    flag1:any=1;
    AllPacks:any ='--Select--';
    changeitm:any;
    packID:any;
  constructor(public toastController: ToastController,public modalctrl:ModalController,public loadcntrl: LoadingServiceProvider,private appconst:PaceEnvironment,private db:DatabaseProvider,public OdsService: OdsServiceProvider,public ViewCtrl: ViewController) {
    this.OpenService();
    this.checked('yes');
  }
  ngOnInit(){
    let self = this;
    this.db.getAllUsers().then(emdata=>{
      
      this.SitId = emdata[0].SiteID; 
      this.Eid = emdata[0].EmpId; 
      this.LogType = emdata[0].LogType; 
      let date = moment(new Date()).format('MM/DD/YYYY HH:mm a');  
      console.log('from createnewservice.....',this.SitId,emdata);
      let packageOptions = {
        SiteId: emdata[0].SiteNumber,
        loggedInEmpId: emdata[0].EmpId,
        EmplogTypeCode: emdata[0].LogType
      }
      this.loadcntrl.presentLoadingCustom();
      self.OdsService.GetPackages(packageOptions).subscribe((data) => {
        self.Service = JSON.parse(data[0].result);
        self.ServiceData = this.Service[0].PACKAGES; 
        this.MainData = self.ServiceData;
        this.MainPackData = this.MainData;
        this.loadcntrl.hideloader();     
        console.log('getpacks data...', data,this.ServiceData );    
       
      });
   });
    
  }
  Cancel(){
    this.ViewCtrl.dismiss();
  }
  OpenService(){
this.ServiceOpen = true;
this.addparts = false;
  }
  AddParts(){
this.addparts = true;
this.ServiceOpen = false;
  }
  checked(type){
    if (type === 'yes') {
      this.ischeck.isyes = true;
      this.ischeck.isno = false;
      
    } else if (type === 'no') {
      this.ischeck.isno = true;
      this.ischeck.isyes = false;
    }
  }
  // filterItems(searchTerm, arr) {
  //   return arr.filter((item) => {
  //     if (!item.TITLE)
  //       item.TITLE = '';
  //     return (item.TITLE.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1) || (item.TITLE.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1);
  //   });
  // }
  // search(){
  //   this.DataSearch = this.filterItems(this.searchdata, this.ServiceData);
  //   console.log('search......', this.DataSearch);
  // }
  onChange(itm){
    //this.MainPackData=[];
    this.changeitm = itm;
    if(itm != '--Select--'){
    console.log('event selection,,,',itm);
      this.Show = true;
     
     if(this.flag == 1){
      let indx = this.ServiceData.findIndex( item =>{
        console.log('index find...', itm);
       return item.TITLE == itm; 
      });
      
      console.log('inex.....', indx,this.SelectService);
      this.SelectService.push(this.ServiceData[indx]);
      this.ServiceData.splice(indx,1);
       this.modalevent();
     }else{
      let indx = this.MainPackData.findIndex( item =>{
        console.log('index find...', itm);
       return item.TITLE == itm; 
      });
      this.flag1 = 0;
      console.log('inex.....', indx,this.MainPackData);
      this.SelectService.push(this.MainPackData[indx]);
       this.MainPackData.splice(indx,1)
     }
    
    }else{
      this.AllPacks = "--Select--";
    }
      

      
    
  }
  modalevent(){
    this.flag = 0;
    this.SelectService.forEach(element => {
      if(element.SITESERVICEDEPARTMENTS.length != 0){
        this.Departments = element.SITESERVICEDEPARTMENTS;
        let type = 'dept';
        let modalno = 'one';
       let Modal = this.modalctrl.create('TestPage',{'type':type , 'Dept':this.Departments,'modalno':modalno},{ cssClass: "full-height-modal" });
       Modal.onDidDismiss((data) => {
        console.log('About to dismiss with one:', data);
        this.deptname = data.DEPARTMENT;
        this.packID = data.SDID;
        this.showservice = true;
         this.MainPackData=[];
       this.ServiceData.forEach(ele=> {
         ele.SITESERVICEDEPARTMENTS.forEach(itm => {
          if(itm.SDID == data.SDID) {
            this.MainPackData.push(ele);
            console.log('this.MainPackData.one...',this.MainPackData);
          }
         });
        
       });
        
    })
       Modal.present();
       
      }
    });
  }
  ShowallDept(){
   
    this.MainPackData=[];
    
this.OdsService.GetallDepartments().subscribe((data) => {
        console.log('all departments,,,,,',data);
          this.Departments = data;
      let type = 'dept';
      let modalno = 'two';
      let Modal = this.modalctrl.create('TestPage',{'type':type , 'Dept':this.Departments,'modalno':modalno,'PackId':this.packID},{ cssClass: "full-height-modal" });
      Modal.onDidDismiss((data) => {
        console.log('About to dismiss with Two:', data);
        this.deptname = data.departmentTitle;
        this. showservice = true;
        this.SelectService =[];
        this.ServiceData.forEach(ele=> {
          ele.SITESERVICEDEPARTMENTS.forEach(itm => {
           if(itm.SDID == data.departmentNumber) {
             this.MainPackData.push(ele);
             console.log('this.MainPackData.Two...',this.MainPackData);
             this.AllPacks = '--Select--';
           }
          });
         
        });
    })
      Modal.present();
      })
    
  }
  
    Remove(idx){
     
      if(this.flag1 == 1){
        this.ServiceData.push(this.SelectService[idx]);
        
       
      }else{
        this.MainPackData.push(this.SelectService[idx]);
        
      }
      
        if(this.SelectService.length == 0){
        this.Show = false;
      }else{
        this.SelectService.splice(idx,1);
        
      }
      this.AllPacks = "--Select--";
      }
      closepart(i){
        this.PartItems.splice(i,1);
      } 
      AddMore(){
            
          if(!this.partname && !this.price || this.partname && !this.price || !this.partname && this.price)
        {
          this.toastController.create({
            message: `Add parts.`,
            duration: 3000
          }).present();
        }
        else{
        this.hide = true;
        let partobj ={
          partname:this.partname,
          price:this.price
        }
         this.PartItems.push(partobj);
         console.log('part items...', this.PartItems);
         this.partname = '';
         this.price = '';
      }
    }
SaveService(){   
let date = moment(new Date()).format('MM/DD/YYYY HH:mm');
    let woinfo:any;
    let wonotes :any='';
    let woparts :any='';
    let woservices:any='';
woinfo = `<Info><woid>${this.workid}</woid><eid>${this.Eid}</eid><sdid>1</sdid><logtype>${this.LogType}</logtype><date>${date}</date><ip>${this.appconst.ipAddress}</ip><action>A</action></Info>`
wonotes = this.NotesData;
this.PartItems.forEach(element => {
  woparts+= `<Info><name>${element.partname}</name><price>${element.price}</price><notes></notes></Info>`
});

this.SelectService.forEach(element => {
  woservices +=  `<Info><ssiid>${element.SSIID}</ssiid></Info>`
});


this.OdsService.DeleteworkOrderException(woinfo,wonotes,woparts,woservices).subscribe((data) => {
  console.log('delete work order exp...', data);
  this.ViewCtrl.dismiss();
})
      }
      onKey(event,ele) {
        if (event.key === "Enter") {
          console.log(event);
          ele.setFocus();
        }
      
      }
}
