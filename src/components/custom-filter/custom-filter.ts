import { Component, ViewChild, ElementRef, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { DatabaseProvider } from '../../providers/database/database';

/**
 * Generated class for the CustomFilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  {
    name:"page-customFilter"
  }
)
@Component({
  selector: 'page-custom-filter',
  templateUrl: 'custom-filter.html',
  providers:[DatePicker]
})
export class CustomFilterPage {
 
 services_select: any = [];
 time:string
 searchedText:string ="";
 float_button:boolean=false;
 dataSearchMoade:any;
 dataSearchModel=[{name:'Active Work Orders',value:'A'},{name:'Open',value:'O'},{name:'In-Progress',value:'I'},{name:'Completed',value:'C'},{name:'Exception Work Orders',value:'E'}];
 public dataOptions: any = {
  siteid: 3269,
  pageNumber: 1,
  pageSize: 20,
  eid: 1,
  searchtext: '',
  searchstatus: 'A',
  searchtype: 0
}
dataOptionsText:any = "0";
dataOptionsModel=[{name:'VIN #',value:'V'},{name:'Stock #',value:'S'},{name:'Work Order #',value:'WO'}];
  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrL:ViewController, 
    private dt: DatePicker, public platform: Platform, private appConst:PaceEnvironment, private rnder:Renderer, private db: DatabaseProvider) {
      

      
      this.float_button=false;
      if(platform.is('ios'))
      {
        //this.platform_tabclass = true;
        this.float_button=true;
      }
      else
      {
        this.float_button=false;
        //this.platform_tabclass = false;
      }
     

    //this.datepicker_mindate = platform.is('ios') == true ? new Date() : new Date().valueOf();

    ///console.log("dt",this.datepicker_mindate);
   // this.selectedCodeValue ="ViN"
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CustomFilterPage');
    this.pageLoadFunc()
  }

  pageLoadFunc(){
   
  }
  searchtext="V";
  
  
closeModal()
  {
    
    this.viewCtrL.dismiss();
    
  }
  
  applytoSearch(){
    //console.log(this.searchedText);
    //console.log(this.searchtext);
    //this.searchtext == "V"
    if(this.searchtext != 'D'){
    let alertMsg=this.dataOptions.searchtype=='V'?'Enter VIN number':this.dataOptions.searchtype=='S'?'Enter STOCK # number':this.dataOptions.searchtype=='WO'?'Enter WORK ORDER # number':''
    if(this.dataOptions.searchtext =="" && this.dataOptions.searchtype != 0){
      this.appConst.ShowAlert(alertMsg)
    }
    else{
    this.viewCtrL.dismiss({searchby:this.dataOptions.searchstatus,searchtype:this.dataOptions.searchtype,searchInput:this.dataOptions.searchtext})
    }
  
  }

  }
  selectDataOpt(data) {
    this.dataOptions.searchtype = data;
  }
  selectDataSearch(data){
    this.dataOptions.searchstatus=data;
  }


  



}
