import { SitesearchPage } from './../sitesearch/sitesearch';
import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ToastOptions, ToastController, Platform, ModalController, LoadingController, reorderArray } from 'ionic-angular';
import { DatePicker } from '@ionic-native/date-picker';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
import { DatabaseProvider } from '../../providers/database/database';
import { OdsServiceProvider } from "../../providers/ods-service/ods-service";
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { Device } from '@ionic-native/Device';

@IonicPage(
  { name: "page-createworkorder" }
)
@Component({
  selector: 'page-create-workorder',
  templateUrl: 'create-workorder.html',
})
export class CreateWorkorderPage {

  empid: any = "";
  empsiteid: any = "";
  emproleid: any = "";
  empdeptid: string = "";
  dlrname: string = "";
  entry: string = "";
  vin: string = "";
  stock: string = "";
  ro: string = "";
  po: string = "";
  changev: string = "";
  changevehicle_obj: any = {};
  services_select: any = [];
  totalservices: any = [];
  totaldepartments: any = [];
  totalpackages: any = [];
  date: string;
  time: string = "";
  time2: string = "";
  changedue: string = "";
  note: string = "";
  requestBy: any = [];
  requestddl: string = "";
  tostoptions: ToastOptions;
  datepicker_mindate: any;
  intialserve: any = "0";
  isScan: string = "N";
  po_required: any = 1;
  ro_required:any=1;
  stock_length: any = 0;
  platform_tabclass: boolean = false;
  siteNumber: any = "";
  change_package: any = "";
  departments_select: any = [];
  emplogtype:any="";
  stockcount_db:any="";
  po_db:any="";
  ro_db:any="";
  siidlist:any=[];
  selected_deptid:any=0;
  totpkg_bakup:any=[];
  lbldeptname:string="";
  pkg_service_list:any=[];
  
  
  isenabled:boolean=false;

  newpkgblock :boolean = false;
  newpakgslist : any ;
  depetRemake:any=[];
  newDeptslist : any =[] ;

  /************************BarCode Data*************************************************** */
  options: BarcodeScannerOptions;
  scannedData: any = {};
  /*********************************************************************************************** */
  constructor(public navCtrl: NavController, public alertcontroller: AlertController, public scanner: BarcodeScanner,
    private dt: DatePicker, private db: DatabaseProvider, private odsservice: OdsServiceProvider, public appconstants: PaceEnvironment, private tostcntrl: ToastController, public platform: Platform
    , public device: Device,private modalctrl:ModalController,public alertController: AlertController,) {
    
      this.odsservice.setValue(true);

      if (platform.is('ios')) {
      this.platform_tabclass = true;
    }
    else {
      this.platform_tabclass = false;
    }
    this.datepicker_mindate = platform.is('ios') == true ? new Date() : new Date().valueOf();
    this.db.getAllUsers().then(emdata => {
      console.log("db data CW",emdata[0]);
      this.empid = emdata[0].EmpId;
      this.empsiteid = emdata[0].SiteID;
      this.empdeptid = emdata[0].DeaprtmentId;
      this.siteNumber = emdata[0].SiteNumber;
      this.emplogtype=emdata[0].LogType;
      this.stockcount_db=emdata[0].StockCount;
      this.po_db=emdata[0].PO;
      this.ro_db=emdata[0].RO;
      if (emdata[0].SiteID != "0" && emdata[0].SiteID != "") {
        this.emproleid = emdata[0].RoleID;
        this.dlrname = emdata[0].SiteTitle;
        this.refreshdata("0");
      this.po_required = (this.po_db.toUpperCase() == 'Y') ? 1 : 0;
      this.ro_required = (this.ro_db.toUpperCase() == 'Y') ? 1 : 0;
      this.stock_length = (this.stockcount_db > 0 && this.stockcount_db!='') ? this.stockcount_db : 8;
      }
      else {
        this.tostoptions = {
          message: "Please Select Site!",
          duration: 3000
        }
        this.tostcntrl.create(this.tostoptions).present();
      }
      this.lbldeptname="";
      this.GetDepartmentsnew();
      this.newpkgblock = false;
    });

   
  }//end for constructor


  refreshdata(flag) {
    this.intialserve = "0";
    this.entry = "single";
    this.vin = "";
    this.stock = "";
    this.ro = "";
    this.po = "";
    this.changev = "";
    this.changevehicle_obj = {};
    this.changedue = "";
    this.note = "";
    this.po_required = 1;
    this.stock_length = 8;
    this.isScan = "N";
    this.setDateAndTime(0, 0);
    this.selected_deptid=0;
    this.siidlist=[];
    this.totpkg_bakup=[];
   // this.getSelectedServices(this.siteNumber, this.empid);
    this.requestedByUsers(this.empsiteid, this.emproleid, "M");
  }
  setDateAndTime(hours, minutes) {
    var d = new Date();
    d.setHours(d.getHours() + hours);
    d.setMinutes(d.getMinutes() + minutes);
    var mon = (d.getMonth() + 1) < 10 ? "0" + (d.getMonth() + 1) : (d.getMonth() + 1)
    var day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate()
    this.date = (mon + "/" + day + "/" + d.getFullYear()).toString();
    var apm = d.getHours() >= 12 ? "PM" : "AM";
    let hr: any = d.getHours() % 12;
    hr = hr ? hr : 12;
    hr = hr < 10 ? '0' + hr : hr;
    let min: any = d.getMinutes();
    min = min < 10 ? '0' + d.getMinutes() : d.getMinutes();
    this.time = hr + ":" + min + " " + apm;
  }
  setThisTime() {
    var hrs: number = 0;
    var mins: number = 0;
    this.services_select.forEach(element => {
      if (element.selected == true) {
        let hr = parseInt(element.time.split(":")[0]);
        let min = parseInt(element.time.split(":")[1]);
        hrs = hrs + hr;
        mins = mins + min;
      }
    });

    this.setDateAndTime(hrs, mins);
  }

  showDatePicker() {

    this.dt.show({
      date: new Date(this.date),
      mode: 'date',
      minDate: this.datepicker_mindate,
      androidTheme: this.dt.ANDROID_THEMES.THEME_DEVICE_DEFAULT_LIGHT
    }).then((data) => {
      var mon = (data.getMonth() + 1) < 10 ? "0" + (data.getMonth() + 1) : (data.getMonth() + 1)
      var day = data.getDate() < 10 ? "0" + data.getDate() : data.getDate()
      this.date = (mon + "/" + day + "/" + data.getFullYear()).toString();
    }, (error) => console.log("Date Error", error))
  }

  showTimePicker() {
    var dts: any = this.date.split("/");
    var tt_hr: any = this.time.split(":")[0];
    var tt_min: any = this.time.split(":")[1].substring(0, 2);
    var tt_apm: any = this.time.split(":")[1].substring(2);
    if (tt_apm.indexOf("P") >= 0) {
      if (tt_hr != 12) {
        tt_hr = parseInt(tt_hr) + 12;
      }
    }
    else if (tt_apm.indexOf("A") >= 0) {
      if (tt_hr == 12) {
        tt_hr = parseInt(tt_hr) + 12;
      }
    }

    var mon: any = parseInt(dts[0]) - 1;

    this.dt.show({
      date: new Date(dts[2], mon, dts[0], tt_hr, tt_min),
      mode: 'time',
      androidTheme: this.dt.ANDROID_THEMES.THEME_HOLO_LIGHT,
      minDate: this.datepicker_mindate

    }).then((data: any) => {

      this.time2 = data.getHours() + ":" + data.getMinutes();
      var apm = data.getHours() >= 12 ? "PM" : "AM";
      let hr: any = data.getHours() % 12;
      hr = hr ? hr : 12;
      hr = hr < 10 ? '0' + hr : hr;
      var min = data.getMinutes() < 10 ? '0' + data.getMinutes() : data.getMinutes();
      this.time = hr + ":" + min + " " + apm;
    }, (error) => console.log("Date Error", error))
  }
  FillStock() {
    this.isScan = "N";
    if (this.vin.length >= 17) {
      this.stock = this.vin.substring(this.vin.length - this.stock_length);
    }
    else
      this.stock = "";
  }
  maxVin(event) {

    let newValue = event.value;

    let regExp = new RegExp('^[A-Za-z0-9]+$');

    if (!regExp.test(newValue)) {

      event.value = newValue.slice(0, -1);

    }
    if (event.value.length > 18)
      event.value = event.value.substring(0, 18)
  }
  maxStock(event) {

    let newValue = event.value;
    let regExp = new RegExp('^[A-Za-z0-9]+$');

    if (!regExp.test(newValue)) {

      event.value = newValue.slice(0, -1);

    }
    if (event.value.length > this.stock_length)
      event.value = event.value.substring(0, this.stock_length);
  }

  changeEntry(value) {
    this.entry = value;
  }

  changedept()
  {
         let alert = this.alertcontroller.create({
          title: 'Selected Packages will be removed if you change the Department. Do you want to continue?',
          buttons: [{
            text: 'Ok',
            handler: () => {
              this.isenabled=false;
              this.pkg_service_list=[];
              this.selected_deptid=0;
              this.siidlist=[]
              this.totalpackages=[];
              this.totalpackages=this.totpkg_bakup.forEach(element => {
                     element.pkgselected=false;
              });;
             // this.totalpackages=this.totpkg_bakup;
              console.log("packages ar dept 0"+JSON.stringify(this.totalpackages));
              //let deptlist=[];
              let deptmodel=this.modalctrl.create('deptModal',{'deptlist':this.departments_select,'flag':'D'});
              deptmodel.present();
              deptmodel.onDidDismiss((data)=>{

                     this.selected_deptid=data.selectedDept;
                     this.lbldeptname="Currently showing Packages from the "+data.deptname+"Department";

                     this.filterpakages();
                  });
            }
          },
          {
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
  reorderItems(value,indexes){
    let element = this.totalpackages[indexes];  
    this.totalpackages.splice(indexes.to, 0, element);
     this.totalpackages.splice((indexes+1),1);   
    console.log(this.totalpackages);
   // this.totalpackages = reorderArray(this.totalpackages,indexes);
  }



  changePackage(value,i) {
    this.isenabled=false;
    if(value.pkgselected==true){
      this.siidlist.forEach((element,index,array) => {
          if(value.SSIID==element){
            this.siidlist.splice(index, 1);
            this.pkg_service_list.splice(index,1);                 
          }
      });
      value.pkgselected=false;
    }
    else{
      this.reorderItems(value.SSIID,i);
      this.siidlist.push(value.SSIID);
      this.pkg_service_list.push(value);
      console.log('siidlist'+JSON.stringify(this.siidlist));
      console.log('pkg_servlist'+JSON.stringify(this.pkg_service_list));
      value.pkgselected=true;
    }
   console.log('slected packages'+this.siidlist);
   
      if(this.siidlist.length==0){
           this.pkg_service_list=[];
        //   this.selected_deptid=0;
       //  this.filterpakages();
      }

 
  }
  copyDeptAndService_select(value)
  {
    let departments = value.Departments;
    if (departments.length > 0) 
    {
      departments.forEach(element => {
        this.departments_select.push({
          "ACTIVE": element.ACTIVE,
          "DEPARTMENT": element.DEPARTMENT,
          "SDID": element.SDID,
          "SISID": element.SISID,
          "SSIID": element.SSIID,
          "selected": false
        })
      });
    }
    else 
    {
      this.departments_select = [];
    }
    let serviceItems = value.ServiceItems;
    if (serviceItems.length > 0)
     {
      serviceItems.forEach(element => {
        this.services_select.push({
          "ACTIVE": element.ACTIVE,
          "APPROVALREQUIRED": element.APPROVALREQUIRED,
          "ISINDWO": element.ISINDWO,
          "ISINVOICE": element.ISINVOICE,
          "ISSEPINVOICE": element.ISSEPINVOICE,
          "ITEMPRICE": element.ITEMPRICE,
          "MASKNAME": element.MASKNAME,
          "MSSIID": element.MSSIID,
          "PIECEPAY": element.PIECEPAY,
          "RATINGREQUIRED": element.RATINGREQUIRED,
          "ROREQUIRED": element.ROREQUIRED,
          "SERVICEITEMNAME": element.SERVICEITEMNAME,
          "SICODE": element.SICODE,
          "SIID": element.SIID,
          "SSIID": element.SSIID,
          "selected": false
        })
      });
      }
    else
     {
      this.services_select = [];
     }
  }


  selectDepartment(dept) {

    this.changev=dept.DEPARTMENT
    this.departments_select.forEach(element => {

      if (element.DEPARTMENT == dept.DEPARTMENT) {
        if (element.selected == true) {
          element.selected = false;
         
        }
        else {
          element.selected = true;
        }
      }
    });

  }

 selectedService(service) {

    let count = 0;;
    for (var i = 0; i < this.services_select.length; i++) {

      if (this.services_select[i].selected == true) {
        count++;
      }
    }
    for (var k = 0; k < this.services_select.length; k++) {
      if (this.services_select[k].SERVICEITEMNAME == service.SERVICEITEMNAME) {


        if (this.services_select[k].selected == true) {
          this.services_select[k].selected = false;
         // this.setThisTime();
        }
        else {
          if (count >= 5) {
            this.appconstants.ShowAlert("You can select only 5 service items");
          }
          else {
            this.services_select[k].selected = true;
           // this.setThisTime();
          }

        }

      }
    }
  }

  changeDueBy(element) {
    this.changedue = element;

  }
  changeddlrequestedby(ele) {
    this.requestddl = ele.id;

  }

  /*****************************************BarCode Reader Methods*********************************************************************************** */
  scan() {
    this.vin = "";
    this.stock = "";
    this.options = {
      prompt: "Place a barcode inside the viewfinder rectangle to scan it"
       ,orientation:'landscape'
    }
    this.scanner.scan(this.options).then((data) => {

      if (data.text.length > 18) {
        this.appconstants.addErrorMessage("VIN characters should not be more than 17");
        this.appconstants.displayErrors();
        this.vin = "";
      }
      else if (data.text.length == 18) {
        this.vin = data.text.substring(1, 18);
        this.stock = this.vin.substring(18 - this.stock_length);
        this.isScan = "Y";
      }else if (data.cancelled == true) {
        this.odsservice.setValue(false);
        }  
      else {
        this.vin = data.text;
        this.stock = this.vin.substring(17 - this.stock_length);
        this.isScan = "Y";
      }
    }, (err) => {
      console.log("Error:", err);
    })
  }
  /****************************************************************************************************************************************************** */

  ionViewCanLeave() {
    let canGoBack = this.odsservice.getValue();
    this.odsservice.setValue(true);
    return canGoBack;
  }

  getSelectedServices(siteid, empid) {
    this.appconstants.startLoading();
    this.totaldepartments = [];
    this.totalpackages = [];
      this.departments_select = [];
      this.services_select = [];
      
    this.odsservice.GetSiteServicesInfo(siteid, this.empid,this.emplogtype).subscribe((data) => {
      let body = JSON.parse(data._body);
      let result = JSON.parse(body[0].result);
      console.log("Sites info", result);
      let totalpackages: any = result[0].PACKAGES;
      if (totalpackages.length > 0) {
        totalpackages.forEach(element => {
          this.totalpackages.push({
            "SSIID": element.SSIID,
            "UNIQUE_PACKAGE_ID": element.UNIQUE_PACKAGE_ID,
            "PACKAGE_TITLE": element.PACKAGE_TITLE,
            "PRICE": element.PRICE,
            "TITLE": element.TITLE,
            "TOTALPAYOUT": element.TOTALPAYOUT,
            "Departments": element.SITESERVICEDEPARTMENTS,
            "ServiceItems": element.SERVICEITEMS,
            "pkgselected": false
          });
          console.log('dept element'+element);

          element.SITESERVICEDEPARTMENTS.forEach(element1 => {
              let cnt=0;
            this.departments_select.forEach(element => {
                   if(element.SDID==element1.SDID)
                         cnt=cnt+1;
            });

            if(cnt==0){
            this.departments_select.push({
              "ACTIVE": element1.ACTIVE,
              "DEPARTMENT": element1.DEPARTMENT,
              "SDID": element1.SDID,
              "SISID": element1.SISID,
              "SSIID": element1.SSIID,
              "selected": false
            });
          }
          });
        });

      this.totpkg_bakup=this.totalpackages;


        }
        else {
          this.departments_select = [];
        }
        this.appconstants.stopLoading();
      });
     
      this.intialserve = "1";

    

  }
     
  checkservice_duplication(){
    if(this.pkg_service_list.length>1)
     {
   //   let msg=``;
    let servicelist=[];
           this.pkg_service_list.forEach(element => {
            if(element.ServiceItems!=undefined && element.ServiceItems.length>0){
           //   servicelist.push({ 'PACKAGE_TITLE':element.TITLE,})
                        element.ServiceItems.forEach(element1 => {
                           servicelist.push({
                             'SIID':element1.SIID,
                             'SSIID':element1.SSIID,
                             'PACKAGE_TITLE':element.TITLE,
                             'SERVICEITEMNAME':element1.SERVICEITEMNAME,
                            'SICODE':element1.SICODE
                            });

                            // msg +=`<div class="divclss1">
                            // <div class="divclss2">${element.PACKAGE_TITLE}</div>
                            // <div class="divclss2">${element1.SERVICEITEMNAME}</div>
                            // </div>`;
                    });
                  }
           });
         
           let result=[];

           servicelist.forEach((item, index) => {
            if (index !== servicelist.findIndex(i => i.SICODE.toUpperCase() === item.SICODE.toUpperCase())) {
              result.push(item);

            }
        });  
               if(result.length>0){
                console.log(servicelist);
                  let deptmodel=this.modalctrl.create('deptModal',{'deptlist':servicelist,'flag':'P'});
                  deptmodel.present();
                return false;
               }
          else
              return true;
              }
              else 
                 return true;
  }
  // ShowAlert(message){
  
  //     alert.present();
  //     this.v_message = "";
  //     this.n_errorcount = 0;
  // }
     
   
     
  async filterpakages()
  {
    this.totalpackages=[];
    if(this.selected_deptid>0){
    this.totpkg_bakup.filter((pakge,)=>{
        pakge.Departments.forEach(element => {
             if(element.SDID==this.selected_deptid)
             {
               if(this.siidlist[0]==pakge.SSIID)
                  pakge.pkgselected=true;
              this.totalpackages.push(pakge);
             }
        });
    });
  }
  else{
    this.selected_deptid=0;
    this.siidlist=[];
    this.totalpackages=[];
    this.pkg_service_list=[];
    //this.totalpackages=this.totpkg_bakup;
    this.totpkg_bakup.forEach(element => {
      this.totalpackages.push({
        "SSIID": element.SSIID,
        "UNIQUE_PACKAGE_ID": element.UNIQUE_PACKAGE_ID,
        "PACKAGE_TITLE": element.PACKAGE_TITLE,
        "PRICE": element.PRICE,
        "TITLE": element.TITLE,
        "TOTALPAYOUT": element.TOTALPAYOUT,
        "Departments": element.Departments,
        "ServiceItems": element.ServiceItems,
        "pkgselected": this.siidlist[0]==element.SSIID?true:false
      });
    });
    console.log("packages ar dept 0"+JSON.stringify(this.totalpackages));
  }
  }


  filterArray(arr, key) {
    return arr.filter((item) => {
      if (item.siteServiceTypeName.toLowerCase().indexOf(key.toLowerCase()) >= 0) {
        return true;
      }
      return false;
    })
  }
  copyToServicesArray(filteredarray) {
    this.services_select = [];
    for (var i = 0; i < filteredarray.length; i++) {
      this.services_select.push({
        "name": filteredarray[i].siteServiceItemName + " (" + filteredarray[i].siteServiceTimeRequired + ")",
        "time": filteredarray[i].siteServiceTimeRequired,
        "id": filteredarray[i].siteServiceNumber,//filteredarray[i].siteServiceItemId,
        "selected": false
      })
    }
  }


  requestedByUsers(siteid, role, target) {
    this.requestddl = "0";
    this.requestBy = [];
    this.requestBy.push({
      "id": 0,
      "name": "Select"
    });
    this.odsservice.GetRequestedByUsers(siteid, role, target).subscribe((response) => {
      if (response.status == 200) {
        var arr = response.json(); 
        for (var g = 0; g < arr.length; g++) {
          this.requestBy.push({
            "id": arr[g].employeeId,
            "name": arr[g].employeeName
          })
        }
      }

    })
  }

  ////////////////////////////////////Submit work order///////////////////////////////////////////////////////////////
  
  submitWorkOrder() {
    if (this.appconstants.CheckNetwork_Connection() == true) {
      this.isenabled=true;
      if(this.checkservice_duplication()==true){
      let notesxml: string = "";

      let count = this.selected_deptid;
      // for (var i = 0; i < this.departments_select.length; i++) {

      //   if (this.departments_select[i].selected == true) {
      //     count++;
      //   }
      // }
          

      if (this.vin == "" && this.stock == "") {
        this.appconstants.addErrorMessage("Enter VIN or STOCK");
      }
      if (this.vin != "") {
        if (this.vin.length < 17) {
          this.appconstants.addErrorMessage("Enter Valid Vin Number");
        }
        else if (this.isScan == "N") {
          if (this.vin.length >= 18) {
            this.appconstants.addErrorMessage("VIN characters should not be more than 17");
          }
        }
      }
      if(this.stock!="")
      {
         if(this.stock.length<this.stock_length)
         this.appconstants.addErrorMessage("Stock length should be  "+this.stock_length+" chars");
      }
     
      if(this.po_required==1)
      {
        if(this.po=="")
        this.appconstants.addErrorMessage("Enter PO");
      }
      if(this.ro_required==1)
      {
        if(this.ro=="")
        this.appconstants.addErrorMessage("Enter RO");
      }
      // if (count == 0) {
      //   //this.appconstants.addErrorMessage("Select at least one service item");
      //   this.appconstants.addErrorMessage("Select Department");
      // }
      
      
        if(count == 0)
        {
          this.appconstants.addErrorMessage("Please Select Department");
        } 
      else {
        if(this.siidlist.length==0)
      {
        this.appconstants.addErrorMessage("Select at least one package");
      } 
      }

      if (this.appconstants.displayErrors() == true) {
        // let servicexml = '<Info>';
        // let servicenotesxml = '';
        // for (let i = 0; i < this.services_select.length; i++) {

        //   if (this.services_select[i].selected == true) {
        //     servicexml += `<ssiid>`+this.services_select[i].SSIID+`</ssiid> `;
        //   }
        // }
        // servicexml+=`</Info>`;
        // notesxml = (this.note != '') ? `<Info><ssiid>${this.changevehicle_obj.SSIID}</ssiid><notes>${this.note.trim()}</notes> <NType>W</NType></Info>` : ""
        let ssiidlist=this.siidlist;
        // let servicexml=`<Info><ssiid>${this.changevehicle_obj.SSIID}</ssiid></Info>`;
        let servicexml="";
        ssiidlist.forEach(element => {
          servicexml +=`<Info><ssiid>${element}</ssiid></Info>`;
        });
           

       let notesxml:any="";
           notesxml=(this.note != '') ? `<Info><ssiid>0</ssiid><notes>${this.note.trim()}</notes><NType>W</NType></Info>`:"";
        let duetime = this.changedue;
        if (duetime != "") {
          if (duetime.toLowerCase() == "waiting") {
            duetime = "CW"
          }
          else if (duetime.toLowerCase() == "spot") {
            duetime = "SPOT";
          }
        }
        var d = new Date();
        var day = (d.getDate() >= 10) ? d.getDate() : '0' + d.getDate();
        var mon = (d.getMonth() + 1);
        var month = mon >= 10 ? mon : "0" + mon;
        var year = d.getFullYear();
        var hours = d.getHours();
        var mins = d.getMinutes() >= 10 ? d.getMinutes() : "0" + d.getMinutes();
        let hr = hours < 10 ? '0' + hours : hours;
        var created_day = month + '/' + day + '/' + year + '  ' + hr + ':' + mins;


        if ((this.isScan == 'Y') && (this.vin.length == 18)) {
          this.vin = this.vin.substring(1, 18);
          this.stock = this.vin.substring(this.vin.length - this.stock_length);
        }
        let wodetails:any={};
        let po=this.po_required == 1 ? this.po.trim().toUpperCase() : this.po.trim().toUpperCase();
        let ro=this.ro_required == 1 ? this.ro.trim().toUpperCase() : this.ro.trim().toUpperCase();
        wodetails=`<Info>
                  <mwoid>0</mwoid> 
                  <vin>`+this.vin.trim().toUpperCase()+`</vin> 
                  <stock>`+this.stock.trim().toUpperCase()+`</stock> 
                  <poid>`+po+`</poid> 
                  <roid>`+ro+`</roid> 
                  <siteid>`+this.empsiteid+`</siteid> 
                  <wodate>`+this.date+`</wodate> 
                  <wotime>`+this.time+`</wotime> 
                  <duetime>`+duetime+`</duetime> 
                  <requestedby>`+this.empid+`</requestedby> 
                  <requestedbylogtype>${this.emplogtype}</requestedbylogtype>               
                  <woctype>I</woctype> 
                  <createtype>M</createtype> 
                  <devicetype>`+this.device.platform+` `+this.device.version+` `+this.db.appversion+ `</devicetype> 
                  <appversion>`+this.db.appversion+`</appversion>
                  <scantype>`+this.isScan+`</scantype> 
                  <ipaddress>`+this.db.ipAddress+`</ipaddress> 
                  <createddate>`+created_day+`</createddate> 
                  <deptid>`+ this.selected_deptid+`</deptid> 
                  <empid>`+this.empid+`</empid> 
                  <empidlogtype>${this.emplogtype}</empidlogtype> 
                  </Info>`;
                      // <wotype>I</wotype> 

     // this.odsservice.CheckWOExceptions(wodetails,servicexml).subscribe(result=>{
      
        // if(result[0].result!="")
        //   {
        //      alert(JSON.parse(result[0].result)[0].Message);
        //      this.isenabled=false;
        //   }
        //   else
        {
             this.odsservice.CreateWorkOrder(wodetails,notesxml,"",servicexml).subscribe((data) => {

          var val = data[0].errId;
          if (val== 0) {
          
            this.appconstants.ShowAlert('Work Order Created Successfully');
            this.appconstants.displayErrors();
            //this.refreshdata("1");

            this.navCtrl.setRoot('home-page');
          }
          else {
            this.isenabled=false;
          }

        },(error)=>{
          alert('Something went wrong!');
          this.isenabled=false;
        })
          }
    //  })

      }
      else{
        this.isenabled=false;
      }
    }
    
    }
  }

  ionViewDidEnter() {
    this.appconstants.CheckNetwork_Connection();
    this.isenabled=false;
  }


GetDepartmentsnew()
{
  this.appconstants.pakgeLoading();
  this.selected_deptid=0;
    let searchstring ="";
    let body2 :any;
    let SID=(this.emplogtype=="C")?0:this.siteNumber;
    searchstring = `<Departments>
                    <E_ID>${this.empid}</E_ID>
                    <S_ID>${SID}</S_ID>
                    <status>Y</status>                    
                    </Departments>`

    // searchstring =  `<Departments>
    // <E_id>1 </E_id>
    // <s_id>0</s_id>
    // <status>Y</status>                    
    // </Departments>`
                    this.odsservice.GetNewDepartments(searchstring).subscribe((data) => {
                      let body = JSON.parse(data._body);  
                      let body1 = JSON.parse(body[0].result); 
                        body2 =  body1[0].TBL_DEPARTMENTS;
                      // this.newDeptslist = body1[0].TBL_DEPARTMENTS;
                      console.log("santu" +  this.newDeptslist );

                      body2.filter(element => {
                        this.newDeptslist.push({
                          "ACTIVE": element.departmentStatus,
                          "DEPARTMENT": element.departmentTitle,
                          "SDID": element.departmentNumber,                    
                          "selected": false
                        });
                        if(element.TBL_SUB_DEPARTMENTS.length>0){

                        let subdept=  element.TBL_SUB_DEPARTMENTS;
                        subdept.filter(item=>{
                          this.newDeptslist.push({
                            "ACTIVE": item.departmentStatus,
                            "DEPARTMENT": item.departmentTitle,
                            "SDID": item.departmentNumber,                    
                            "selected": false
                          });
                        });
                        }
                      });

                      this.appconstants.stopLoading();
                 },()=>{this.appconstants.stopLoading();});
}


  selectDepartmentdiv(dept)
  {
    this.appconstants.pakgeLoading();
    this.newDeptslist.filter(item=>
      {
        if(dept.SDID==item.SDID)
            item.selected=true
        else
        item.selected=false
      });
   
    this.selected_deptid=dept.SDID;
    let SearchString :any ="";
    
    SearchString =`<Info>
                    <s_id>${this.siteNumber}</s_id>
                    <type>M</type>
                    <dept_id>${dept.SDID}</dept_id>
                    <e_id>${this.empid}</e_id>
                    <logtype>${this.emplogtype}</logtype>
                  </Info>`

  //   SearchString =`<Info>
  //   <s_id>3269</s_id>
  //   <type> M </type>
  //   <dept_id>1</dept_id>
  //   <e_id>1</e_id>
  //   <logtype>C</logtype>
  // </Info>`
  
  this.pkg_service_list=[];
  this.totalpackages=[];
  this.siidlist=[];
      
          this.newpkgblock = true;
          this.odsservice.GetrelatedPackages(SearchString).subscribe((data) => {
            let body = JSON.parse(data._body);
            let body1 = JSON.parse(body[0].result);
         let   body2 = body1[0].PACKAGES;
             console.log("san-packages" +  this.totalpackages);  
             body2.filter(element => {
              this.totalpackages.push({
                "SSIID": element.SSIID,
                "UNIQUE_PACKAGE_ID": element.UNIQUE_PACKAGE_ID,
                "PACKAGE_TITLE": element.PACKAGE_TITLE,
                "PRICE": element.PRICE,
                "TITLE": element.TITLE,
                "TOTALPAYOUT": element.TOTALPAYOUT,            
                "ServiceItems": element.SERVICEITEMS,
                "pkgselected":false              
              });            
          });
          this.appconstants.stopLoading();
        },()=>{ this.appconstants.stopLoading();});
     
}

}