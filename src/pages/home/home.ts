import { Component } from '@angular/core';
import { IonicPage, ModalController, Platform, Events, NavController, App } from 'ionic-angular';
import { DatabaseProvider } from '../../providers/database/database';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';
import { NativeStorage } from '@ionic-native/native-storage';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'home-page'
})
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  dlrname: string = "";
  dealersiteId: any;
  empid: any = "";
  emplogtype:any;
  empresult: any = [];
  emplog: any;
  sitecount: any = "";
  platform_dlrlbl: boolean = false;
  platform_dlrarrow: boolean = false;
  sitenumber: any = "";
  access_permission: any = "";
  constructor(private db: DatabaseProvider,
    public odsservice: OdsServiceProvider, private appconst: PaceEnvironment,
    public modalctrl: ModalController,
    public platform: Platform, private events: Events,
    private loadingSrv: LoadingServiceProvider,
    public navController: NavController,
    private storage:NativeStorage,
    private app:App) {
    if (platform.is('ios')) {
      this.platform_dlrarrow = true;
      this.platform_dlrlbl = true;
    }
    else {
      this.platform_dlrarrow = false;
      this.platform_dlrlbl = false;
    }

    this.db.getAllUsers().then(res => {
      this.empresult = res[0];

      this.empid = res[0].EmpId;
      this.dlrname = res[0].SiteTitle;
      this.sitenumber = res[0].SiteNumber;
      this.emplogtype=res[0].LogType;
      if (this.dlrname.length > 26) {
        this.dlrname = this.dlrname.substring(0, 26) + "..";
      }
      this.dealersiteId = res[0].SiteID;
      this.sitecount = res[0].SiteCount;

      if (this.empresult.SiteID == 0) {
        this.getSiteInfo(this.empid, this.empresult.LogType);
      }
      else {
        if (res[0].Permission == "Y") {
          this.events.publish('permission:Y');
          this.access_permission = "Y";
        }
        else {
          this.events.publish('permission:N');
          this.access_permission = "N";
        }

      }
    });

  }
  /*************Getting Site info****************** */
  getSiteInfo(empid, logType) {
    this.appconst.sitetartLoading();
    this.odsservice.GetEmployeeSiteInfo(empid, logType).subscribe((data) => {
      let site=[]
     // if (data.status == 200) {
      console.log("site raw info"+data)
        let value = JSON.parse(data[0].result);
        console.log("sites info"+data);
        for (let i = 0; i < value.length; i++) {
          if (value[i].siteStatus === 'Y') {
            let status: boolean = false
            if (value[i].siteId == this.dealersiteId) {
              status = true;
            }
            site.push({
              "siteId": value[i].siteId,
              "siteTitle": value[i].siteTitle,
              "siteLogo": value[i].siteLogo,
              "siteNumber": value[i].siteNumber,
              "status": status
            })
          }
        }
          
      this.storage.setItem("ops_siteinfo", site).then(()=>{});
          console.log('site data', value)
        // value[i].siteStatus === 'Y'
        if (value.length > 0) {

          this.sitecount = value.length;
          //  this.dealersiteId=value[0].empSiteNumber;
          //  this.dlrname=value[0].empSiteTitle;
          this.dealersiteId = value[0].siteId;
          this.dlrname = value[0].siteTitle;
          this.sitenumber = value[0].siteNumber;
          if (this.dlrname.length > 26) {
            this.dlrname = this.dlrname.substring(0, 26) + "..";
          }
          let siteLogo = value[0].siteLogo, stockcount: any = "8", po: any = "N", ro: any = "N"
          this.odsservice.GetStockPORODetails(this.dealersiteId).subscribe(resdata => {
            console.log("result", JSON.parse(resdata[0].result));
            let result = JSON.parse(resdata[0].result)[0];
            if (result.SITEPREFERENCES.length > 0) {
              let dt = result.SITEPREFERENCES[0];
              stockcount = dt.STOCKLENGTH;
              po = dt.POREQ;
              ro = dt.ROREQ;
            }
            else {
              stockcount = 8;
              po = "N";
              ro = "N";
            }
            let siteno = (logType=='C') ? 0 : this.sitenumber;
            this.odsservice.GetWOPermissionDetails(this.empid, siteno).subscribe(response => {
              if (response[0].result != "") {
                let value = JSON.parse(response[0].result)[0];
                console.log("Permission Response", value);
                let create: any = "N"
                if (value.Create.toUpperCase() == "Y") {
                  create = "Y";
                  this.access_permission = "Y";

                  this.events.publish('permission:Y');
                }
                else {
                  this.access_permission = "N";

                  this.events.publish('permission:N');
                }


                this.db.UpdateSiteInfo_EMP(this.dealersiteId, siteLogo, this.dlrname, this.empresult.EmpId, this.sitecount, this.sitenumber, stockcount, po, ro, create).then((data) => {
                  this.appconst.stopLoading();
                },error=>{ this.appconst.stopLoading();})
              }
              else {
                this.access_permission = "N";

                this.events.publish('permission:N');
                this.db.UpdateSiteInfo_EMP(this.dealersiteId, siteLogo, this.dlrname, this.empresult.EmpId, this.sitecount, this.sitenumber, stockcount, po, ro, 'N').then((data) => {
                  this.appconst.stopLoading();
                },error=>{ this.appconst.stopLoading();})
              }

            })

          })

        }
        else {
          this.dlrname = "Please select site";
          this.dealersiteId = 0;
          this.appconst.stopLoading();
        }
      
    })
  }
  ionViewDidEnter() {
    this.appconst.CheckNetwork_Connection();
  }

  changeSite() {
    
    this.storage.getItem("ops_siteinfo").then((data) => {
      console.log("Loading Data :", data);
  if(data.length>0){
      let modal = this.modalctrl.create('page-sitesearch', { 'Data': data });
      modal.present();

      modal.onDidDismiss((data) => {

        if (typeof data == "undefined" || data.sitesearchresult == "") {

        }
        else {
          this.appconst.startLoading();
          this.dealersiteId = data.sitesearchresult.siteId;
          this.dlrname = data.sitesearchresult.siteTitle;
          this.sitenumber = data.sitesearchresult.siteNumber;
          if (this.dlrname.length > 26) {
            this.dlrname = this.dlrname.substring(0, 26) + ".."
          }
          let stockcount: any = "8", po: any = "N", ro: any = "N";
          this.odsservice.GetStockPORODetails(this.dealersiteId).subscribe(resdata => {
            console.log("result", JSON.parse(resdata[0].result));
            let result = JSON.parse(resdata[0].result)[0];
            if (result.SITEPREFERENCES.length > 0) {
              let dt = result.SITEPREFERENCES[0];
              stockcount = dt.STOCKLENGTH;
              po = dt.POREQ;
              ro = dt.ROREQ;
            }
            else {
              stockcount = 8;
              po = "N";
              ro = "N";
            }
            let siteno = (this.empresult.LogType.trim()=='C') ? 0 : this.sitenumber;
            this.odsservice.GetWOPermissionDetails(this.empid, siteno).subscribe(response => {
              if (response[0].result != "") {
                let value = JSON.parse(response[0].result)[0];
                console.log("Permission Response", value);
                let create: any = "N"
                if (value.Create.toUpperCase() == "Y") {
                  create = "Y";
                  this.access_permission = "Y";
                  this.events.publish('permission:Y');
                }
                else {
                  this.access_permission = "N";
                  this.events.publish('permission:N');
                }

                this.db.UpdateSiteInfo_EMP(this.dealersiteId, data.sitesearchresult.siteLogo, this.dlrname, this.empresult.EmpId, this.sitecount, this.sitenumber, stockcount, po, ro, create).then((data) => {
                  this.appconst.stopLoading();
                })
              }
              else {
                this.access_permission = "N";
                this.events.publish("permission:N");
                this.db.UpdateSiteInfo_EMP(this.dealersiteId, data.sitesearchresult.siteLogo, this.dlrname, this.empresult.EmpId, this.sitecount, this.sitenumber, stockcount, po, ro, 'N').then((data) => {
                  this.appconst.stopLoading();
                })


              }
            })

          })

        }
      })
    } 
    else
    {
      this.getSiteInfo(this.empid,this.emplogtype.trim());
    }
    },error=>{ this.getSiteInfo(this.empid,this.emplogtype.trim());})
  }//end for changeSite()



  openPage(pageName: string,item) {
    let loader = this.loadingSrv.createLoader();
    if (pageName == 'page-createworkorder')
    {
      if (this.access_permission != 'Y') {
        alert("You have no permissions to create work order");
        return false;
      }
    }
    else{
    this.navController.setRoot(pageName, {itm:item})
     }
    // loader.present().then((value:any)=>{
    //   this.navController.push(pageName,{itm:item}).then(val => {
    //     loader.dismiss();
    //   }).catch(err => {
    //     console.log(err);
    //     loader.dismiss();
    //   });
    // },err=>{
    //   console.log(err);
      
    // });
    // //console.log('hi');
    
    
  }

}



