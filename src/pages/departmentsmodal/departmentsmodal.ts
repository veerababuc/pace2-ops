import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,Platform } from 'ionic-angular';
import { PaceEnvironment } from '../../common/PaceEnvironment';

/**
 * Generated class for the DepartmentsmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name : 'deptModal'
})
@Component({
  selector: 'page-departmentsmodal',
  templateUrl: 'departmentsmodal.html',
})
export class DepartmentsmodalPage {

  packIndex :any;
  selPackage :any;
  departments_select:any;
  depetRemake:any=[];
  selectedDepts:any=[];
  deptid:any=0;
  deptname:string="";
  flag:string="";
  pkg_service:any=[];
  unregisterBackButtonAction:any;
  constructor(public navCtrl: NavController,private platform:Platform,
     public navParams: NavParams,private viewcon : ViewController, public appconstants: PaceEnvironment) {

   // this.selPackage = this.navParams.get('deptlist');
      this.flag=this.navParams.get('flag');
      if(this.flag=="D"){
        this.departments_select = this.navParams.get('deptlist');
      }
      else if(this.flag=="P"){
       this.pkg_service= this.navParams.get('deptlist');
      }
    


    // this.departments_select.forEach(element => {
    //   var selPack = element.Departments;
    //   console.log("Sub Depat"+ JSON.stringify(element));
    //   selPack.forEach(e => {
    //     var deptArry = {
    //       'ACTIVE' : e.ACTIVE,
    //       'DEPARTMENT' : e.DEPARTMENT,
    //       'SDID' : e.SDID,
    //       'SISID' : e.SISID,
    //       'SSIID' : e.SSIID
    //     }

    //     console.log("Single Dept:"+deptArry);
    //     this.depetRemake.push(deptArry);

    //   });

  //  });

     this.depetRemake=this.departments_select ;
  // console.log("Selected Packages :"+this.selPackage);
    console.log("Remake Array :"+ JSON.stringify( this.depetRemake));
  }

  initializeBackButtonCustomHandler(): void {
    console.log('register');
    this.unregisterBackButtonAction = this.platform.registerBackButtonAction(function(event){
     // this.closeModal();
     return false;
    }, 101); // Priority 101 will override back button handling (we set in app.component.ts) as it is bigger then priority 100 configured in app.component.ts file */
}  

  ionViewDidLoad() {
    console.log('ionViewDidLoad DepartmentsmodalPage');
    this.initializeBackButtonCustomHandler()
  }
  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    console.log('unregister');
    this.unregisterBackButtonAction && this.unregisterBackButtonAction();
}
 
  //Close Department Modal
  closeModal(){
    if(this.flag=="D")
   this.viewcon.dismiss({'selectedDept':this.deptid,'deptname':this.deptname});
   else if(this.flag=="P")
       this.viewcon.dismiss();
  }

  //Selected Departments
  selectedDept(ind,depts){
     // this.depetRemake[ind].isChecked = true;
   //   this.selectedDepts.push(depts);
   this.deptid=depts.SDID;
   this.deptname=depts.DEPARTMENT;
   console.log('dept name'+depts.DEPARTMENT);
   console.log('dept id'+depts.SDID);
      this.viewcon.dismiss({'selectedDept':this.deptid,'deptname':this.deptname});
  }

  submitDept()
  {
    console.log(this.deptid);
    if(this.deptid =="")
    {
      this.appconstants.addErrorMessage("Select atleast one Department");
    }

    if(this.appconstants.displayErrors()==true)
    {
      this.closeModal();
    }
  }


}
