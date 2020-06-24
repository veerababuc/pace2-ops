import { Component, ViewChild } from '@angular/core';
import { Platform,ToastController,Events, MenuController, Nav} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {App, IonicApp} from 'ionic-angular';
import {DatabaseProvider } from '../providers/database/database';
import { Network } from '@ionic-native/network';
import { NetworkInterface } from '@ionic-native/network-interface';
//import {FCM} from '@ionic-native/fcm';
import { PaceEnvironment } from '../common/PaceEnvironment';
import { AppVersion } from '@ionic-native/app-version';
import { NativeStorage } from '@ionic-native/native-storage';
import { Device } from '@ionic-native/device';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  backBtnCounter = 0;
  rootPage:any ='';
  user:any={Name:"",Password:""}
  pages:Array<{title:string,component:any,name:string}>
  platform_menulist:boolean=false;
  appVersionData : any;

  constructor(private device: Device,private appVersion: AppVersion,private platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
     public db:DatabaseProvider, public app:App,private network:Network, public networkinteface:NetworkInterface,public ionicapp:IonicApp,
    // public fcm:FCM,
    //private appVersion: AppVersion,
    private storage:NativeStorage,
    private appconst:PaceEnvironment, private events:Events,
    private toastCtrl: ToastController,
    private ionicApp: IonicApp,
    public menu: MenuController) {
    platform.ready().then(() => {
      
      this.AppVersion(); //Getting App version 

      if(platform.is('ios'))
       {
          this.platform_menulist=true;
       }
       else
       {
         this.platform_menulist=false;
       }

  /****************************************************** */
    /*******************IPADRESS*********************************** */
    this.db.getIP().subscribe((data:any)=>{
      this.db.ipAddress=data.ip;
      this.appconst.ipAddress=data.ip;
      console.log('ip'+this.db.ipAddress);
    },error=>{
          console.log('error at ip addres');
    });
/****************************************************** */
       /************************NETWORK CHECK****************************** */
     
      let connct= this.network.onConnect().subscribe((data) => {
         this.displayNetworkUpdate(data.type);
      });
     
     let disconnt= this.network.onDisconnect().subscribe((data) => {
         this.displayNetworkUpdate(data.type);
      });
 /****************************************************** */
      statusBar.styleDefault();
      statusBar.backgroundColorByHexString("#131821");
      statusBar.styleLightContent();
      splashScreen.hide();
       
     
       /***************BACK BUTTON Handling*************************************** */
       if(platform.is('android'))
       {
        platform.registerBackButtonAction(() => {this.backBtnAction()}, 0);
       }
        /****************************************************** */
 this.db.getDatabaseState().subscribe((result)=>{
  console.log("Database State",result);
  if(result)
  {
    this.db.getAllUsers().then((data:any)=>{
      this.user=data;
      console.log("User data",this.user)
     if(this.user.length>0)
      {

        this.appconst.empName = this.user[0].Empname;
        this.appconst.empRole = this.user[0].Rolename;
        this.appconst.empProfileImage = this.user[0].Emplogo;
       
      if(this.user[0].Rem=="Y")
       {
         this.app.getRootNavs()[0].setRoot("home-page")
       }else
         this.rootPage='login-page';
      }else
      this.rootPage='login-page';
     
      
   })
  }
 })
 this.appVersion.getVersionNumber().then((data) => {
  this.appVersionData = data;
  });
  });

    
      this.pages=[
        {title:"Home",component:"home-page",name:"Home" },
        {title:"Create Work Order",component:"page-createworkorder", name:"CreateWorkorder"},
        {title:"Work Order Queue",component:"page-workorderqueue", name:"WorkorderQueue"},
     ];
   
  events.subscribe("permission:N",()=>{
    this.pages=[
      {title:"Home",component:"home-page",name:"Home" },
   //   {title:"Create Work Order",component:"page-createworkorder", name:"CreateWorkorder"},
      {title:"Work Order Queue",component:"page-workorderqueue", name:"WorkorderQueue"},
     
   ];
  });
  events.subscribe("permission:Y",()=>{
    this.pages=[
      {title:"Home",component:"home-page",name:"Home" },
      {title:"Create Work Order",component:"page-createworkorder", name:"CreateWorkorder"},
      {title:"Work Order Queue",component:"page-workorderqueue", name:"WorkorderQueue"},
   ];
  });
    

  }

  //Getting App Version
  AppVersion(){
    this.appVersion.getVersionNumber().then((data) => {
      console.log("App Version :",data);
      this.appVersionData = data;
      this.appconst.appVersion = data;
      this.appconst.deviceInfo = this.device.platform;
    })

    
  }
   
  Logout()
  {
    
      this.db.deleteUser().then((data)=>
     {
        this.user.Name="";
        
      this.storage.setItem('ops_userlist',[]).then();
      this.storage.setItem('ops_siteinfo',[]).then();
        this.app.getActiveNav().setRoot("login-page");
     }
    
    ),(error)=>{console.log("Error while truncating",error)}
  }

  openPage(page) {
    let name= localStorage.getItem("Username")
  if(page.component=="home-page")
   this.app.getActiveNav().setRoot("home-page",{Name:name})
 else
    this.app.getActiveNav().push(page.component);
  }
  
  displayNetworkUpdate(connectionState: string){
    let networkType = (this.network.type=="none")?"":"via "+this.network.type;
    if(this.network.type.toLowerCase()=="wifi")
    {
      this.networkinteface.getWiFiIPAddress().then((data:any)=>{
         this.db.ipAddress=data.ip;
      }).catch(err=>{
        console.log("Error at wifi ip",err)
        this.db.ipAddress="";
      })
    }
    else{
      this.networkinteface.getCarrierIPAddress().then((data:any)=>{
         this.db.ipAddress=data.ip;
      }).catch(err=>{
        console.log("Error at carrier ip",err)
        this.db.ipAddress="";
      })
    }
    // this.toast.create({
    //   message: `You are now ${connectionState} ${networkType}`,
    //   duration: 3000
    // }).present();
  }
 
 

  backBtnAction()
  {
    let ionicApp = this.ionicApp;
    let activePortal = ionicApp._loadingPortal.getActive() ||
        ionicApp._modalPortal.getActive() ||
        ionicApp._toastPortal.getActive() ||
        ionicApp._overlayPortal.getActive();

    if (activePortal) {
        return activePortal.dismiss();
    }

    let navChild = this.nav.getActiveChildNav();

    while (true) {
        if (!navChild) {
            break;
        }

        if (navChild.canGoBack()) {
            return navChild.pop();
        }

        navChild = navChild.getActiveChildNav();
    }

    if (this.nav.canGoBack()) {
        return this.nav.pop();
    }
    
    if (this.menu.isOpen()) {
        return this.menu.close();
    }

    if (this.backBtnCounter == 0) {
      this.backBtnCounter++;
      this.toastCtrl.create({ message: 'Press again to exit', duration: 3000 }).present();
      setTimeout(() => { this.backBtnCounter = 0 }, 3000)
    }
    else {
      this.platform.exitApp();
    }
}

}


