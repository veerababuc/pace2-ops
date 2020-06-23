import{Injectable,OnInit } from '@angular/core'
import { AlertController, LoadingController, ToastController } from 'ionic-angular';
declare var navigator:any;
@Injectable()
export class PaceEnvironment implements OnInit{
  public loadingPopup: any;
    public API_url :any;
    public n_errorcount :any=0;
    public v_message :any='';
    public headers;
    public ApiUrl:any;
    public newApiUrl:any="";
    public Paceimg:any;
    public ipAddress:any="";
    public appVersion:any='0.0.1';
    public empName:any;
    public empRole:any;
    public empInfo : any;
    public empProfileImage : any;
    public woIndexUpdate = -1;
    public woUpdateObj  : any;
    public woUpdateType : any;
    public deviceInfo   : any;

constructor( public alertController: AlertController,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,
    public alertCtrl: AlertController )
    {
      //this.ApiUrl="http://api.onsitepace2.com/api/";
      this.ApiUrl="https://servapi.onsitedealersolutions.com/api/";
      // this.ApiUrl="http://pace2api.onsitedealersolutions.com/api/";
      //this.ApiUrl="http://devpace2api.onsitedealersolutions.com/api/";
      // this.ApiUrl="http://paceadmin.onsitedealersolutions.com/ws/api/";
      this.Paceimg="http://paceadmin.onsitedealersolutions.com/images/"
}
ngOnInit(){
 
}

  addErrorMessage(msg) {
      this.n_errorcount = this.n_errorcount + 1;
      this.v_message =
      this.v_message + "(" + this.n_errorcount + ") " + msg + "<br/>";
  }

  displayErrors() {
    if (this.n_errorcount == 0) {
      return true;
    } else {
      let alert = this.alertController.create();
      alert.setTitle("Please check the following: <p>" + this.v_message+"</p>");
      alert.addButton({
        text: "OK"
      });
      alert.present();
      this.v_message = "";
      this.n_errorcount = 0;
      return false;
    }
  }

  showCredentialsAlert() {
    let alert = this.alertController.create({
      title: "",
      subTitle: "Invalid User Name or Password",
      buttons: ["OK"]
    });
    alert.present();
  }
  
   startLoading()
   {
     this.loadingPopup=this.loadingCtrl.create({
       enableBackdropDismiss:true,
       content:`<div class="loading-Header" ></div>
       <div class="custom-spinner-container">
       <div class="custom-spinner-box">
       <div class="loading-body"> Loading... </div>
       </div>
     </div>`,
     duration:1000*20
     });
     this.loadingPopup.present();
   }

   stopLoading()
   {
      setTimeout(()=>{
        this.loadingPopup.dismiss();
        return false;
      },500);
   }

 ShowAlert(message){
    let alert = this.alertController.create();
      alert.setTitle(message);
      alert.addButton({
        text: "OK"
      });
      alert.present();
      this.v_message = "";
      this.n_errorcount = 0;
  }

  public CheckNetwork_Connection():boolean {
    
    var networkState = navigator.connection.type;
    if (networkState == "none") {
      this.toastController.create({
        message: `You are now offline`,
        duration: 3000
      }).present();
        
        return false;
    }
    else {
        return true;
    }

}
sitechangealert()
{
  this.toastController.create({
    message: `Change the site from home page.`,
    duration: 3000
  }).present();
}
}