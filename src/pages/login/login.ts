import { Component, OnInit } from '@angular/core';
import { IonicPage, MenuController, NavController, } from 'ionic-angular';
 import { Device } from '@ionic-native/device';
import { FormGroup, FormControl, Validators } from '@angular/forms';
 import { PaceEnvironment } from '../../common/PaceEnvironment';
 import { DatabaseProvider } from '../../providers/database/database'
 import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
 import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'login-page'
})
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  signupForm: FormGroup;
  keepmeloggedin: any = {}
  userdata:any={}
  signedin:boolean;
  constructor(public navCtrl: NavController,
    
      public device: Device,
      public paceenvi: PaceEnvironment,
      private db: DatabaseProvider
     , private odsservice: OdsServiceProvider, 
     public loadingSrv: LoadingServiceProvider, 
    public menu: MenuController,
  ) {
    this.menu.enable(false);
    this.keepmeloggedin.selected = true;
   
   
  }
  ngOnInit() {
    this.signupForm = new FormGroup({
      'username': new FormControl('', Validators.required),
      'password': new FormControl('', Validators.required),

    });
  }
  checklogin() {
    if (this.paceenvi.CheckNetwork_Connection() == true) {
      let kml = this.keepmeloggedin.selected == true ? 'Y' : 'N';
      if (!this.signupForm.controls["username"].valid)
        this.paceenvi.addErrorMessage("Enter User Name");
      if (!this.signupForm.controls["password"].valid)
        this.paceenvi.addErrorMessage("Enter Password");
      if (this.paceenvi.displayErrors() == true) {
        this.Emptraditional_login(this.signupForm.controls["username"].value,
          this.signupForm.controls["password"].value, kml)
          
     }
   }
  }
  Emptraditional_login(userid, pcode, rem) {  
    let loader = this.loadingSrv.createLoader();
    loader.present();
    this.odsservice.EmployeeTraditionalCheckIn(userid, pcode,this.device.uuid).subscribe(data => {
      
      // if (data[0].employeeStatus == "Valid") {
      if (data[0].userId > 0) {
        if(data[0].userLogType == 'D'){
            alert("You are not allowed to log in. Please log in through the dealer app.");
            loader.dismiss();
        }
        else{
        let empinfo: any;
        this.odsservice.GetEmployeeInformation(data[0].userId).subscribe(result => {
          empinfo = JSON.parse(result)[0].TBL_EMP[0];
          console.log("empinfo",empinfo);
          if(empinfo)
          {
            this.db.createUser(data[0].userId, empinfo.EmployeeName,userid,pcode,
              empinfo.EmployeeRoleID, empinfo.EmployeeRoleName,data[0].userTokenId,rem,empinfo.EmployeeImage, empinfo.TBLSITES[0].EmployeeGroupID,data[0].userLogType.trim())
             .then((res) => {
             
               // this.odsservice.SendFCMToken(data[0].userId, this.db.fcmtoken, this.db.ipAddress).subscribe(result => {
               //   console.log("Added Token::", result.json());
                 loader.dismiss();
                 this.navCtrl.setRoot("home-page");
               // })
             }, (error) => {
               loader.dismiss();
               console.log("Error:", error)
               alert("try again");
             });
            
          }
        
          else{
            console.log("error at empinfo");
          }
        
        });
      }
    }
      else {
        loader.dismiss();
        this.paceenvi.showCredentialsAlert();
      }
    });
   }

  ionViewWillLeave() {
    // enable the root left menu when leaving this page
    this.menu.enable(true);
  }
  ionViewDidEnter() {
    // this.paceenvi.CheckNetwork_Connection();
  }
}
