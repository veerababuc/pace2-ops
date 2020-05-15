import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Platform, ModalController, AlertController, ToastController } from 'ionic-angular';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { DatabaseProvider } from '../../providers/database/database';
import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';
/**
 * Generated class for the WorkOrderDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name : 'workDetails'
})
@Component({
  selector: 'page-work-order-details',
  templateUrl: 'work-order-details.html',
})
export class WorkOrderDetailsPage {

  woIndx        : any;
  float_button  : boolean=false;
  worDetails    : any;
  siteid        : any;
  empid         : any;
  loggedEmp     : any;
  headerName    : any;
  emplogtype    : any = 'C';
  emplist       : any = [];
  
  addinfinitescroll   : boolean = false;
  infintescrollevent  : any;
  workOrderPermission : any;
  empListModel        : any[] = [];
  selectedEmpId       : string = "0";
  selectOptions       : true;
  selectpackege       : boolean = false;
  serviceUpdatedObj   : any;
  public dataOptions: any = {
    siteid: 3269,
    pageNumber: 1,
    pageSize: 20,
    eid: 1,
    searchtext: '',
    searchstatus: 'A',
    searchtype: 0
  }

  dataOptionsModel  =[{name:'VIN #',value:'V'},{name:'Stock #',value:'S'},{name:'Work Order #',value:'WO'}];  
  dataSearchModel   =[{name:'Active Work Orders',value:'A'},{name:'Open',value:'O'},{name:'In-Progress',value:'I'},{name:'Completed',value:'C'},{name:'Exception Work Orders',value:'E'}];


  constructor(public toastCtrl: ToastController,private loadingSrv: LoadingServiceProvider,public alert: AlertController,
    public db: DatabaseProvider,public OdsSvc: OdsServiceProvider,public paceEnv: PaceEnvironment,
    public modalctrl: ModalController,public navCtrl: NavController, public navParams: NavParams,
    public viewctrl:ViewController,public platform:Platform, public changeDetectorRef:ChangeDetectorRef,
    private zone: NgZone) {

    this.worDetails = this.navParams.get('worDetails');
    this.siteid     = this.navParams.get('siteId');
    this.woIndx     = this.navParams.get('woIndx');
    console.log('Out Put :' , this.worDetails);

    if(platform.is('ios'))
    {
      this.float_button=true;
    }
    else
    {
      this.float_button=false;
    }


    this.db.getAllUsers().then(emdata => {
      console.log('emdata', emdata);
        this.dataOptions.siteid = emdata[0].SiteNumber;
        this.dataOptions.eid = emdata[0].EmpId,
        this.emplogtype = emdata[0].LogType.trim();
        this.loggedEmp = emdata[0].EmpId;
        this.headerName = emdata[0].SiteTitle;
        if (this.headerName.length > 15) {
          this.headerName = this.headerName.substring(0, 15) + "..";
        }
      //this.paceEnv.startLoading();
      this.getAssigmentlist();
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkOrderDetailsPage');
  }


  closeModal()
  {
    this.viewctrl.dismiss();
  }

  //Edit VIN
  edit(wo, action) {
    let loader = this.loadingSrv.createLoader();
    loader.present();
    let Modal = this.modalctrl.create('ModalpagePage', { workOrderObj: wo, action: action }, { cssClass: "full-height-modal" });
    Modal.onDidDismiss(data => {
      if (String(data) !== 'undefined') {
        //console.log(action);
        this.worDetails = Object.assign({}, data.woorder);
       }
    });
    Modal.present().then(val => {
      loader.dismiss();
    }).catch(err => {
      console.log(err);
      loader.dismiss();
    });
  }

  //Getting service item status color
  getColor(stus){
    //console.log(stus);
    if (stus == 'I') { return '#ef473a'; } 
    else if (stus == 'A') { return '#006da5'; } 
    else if (stus == 'C') { return '#33cd5f'; } 
    else if (stus == 'O') { return '#11c1f3'; }
  }

  //Open Notes modal
  openNotes(Snotes){
    //this.appconst.startLoading();
    console.log(Snotes);
    // this.appconst.startLoading();
    let Type = "DS"
    
    let Modal = this.modalctrl.create('WonotesPage', { NotesObj: [] ,SId: Snotes.woServiceId, Type:Type });
    Modal.onDidDismiss(data => {
      // if (data == 'SuccessfullyUpdated') {
      //   this.flagForUpdateFunc = "Y";
      // }
    });
    Modal.present();
  }

  getWoServiceDetails(ssid){
    return this.worDetails.WOSERVICES = this.worDetails.WOSERVICES.filter((x) => {
              if(x.SSIID === ssid){
                return x;
              }
      });
  }
  

  getlength(ex, list, SId) {
    if(ex == 'S'){
      let newlist = list.filter((x: any) => { if( x.WOSID == SId) return x.TYPE === ex; })
      return newlist.length;
    }
    else{
      let newlist = list.filter((x: any) => { return x.TYPE === ex; })
      return newlist.length;
    }  
  }


  NotesModal(notes, wo, notetype, woIndex,SId) {
    console.log('subworkorder note', notes, wo, notetype,SId);
    // let loader = this.loadingSrv.createLoader();
    // loader.present();
    var nots = notes;
    var woDetais = wo;
    let Modal = this.modalctrl.create('TestPage', { 'type': nots, 'Wodata': woDetais, 'NType': notetype, 'SId':SId }, { cssClass: "full-height-modal" });
    Modal.onDidDismiss((val) => {
      //this.ViewCtrl.dismiss();
      if(val==1){
      this.paceEnv.startLoading();
      console.log('in workorderqueu page');
      let searchOptions: string = `<Info><siteid>${this.dataOptions.siteid}</siteid><pageNumber>1</pageNumber><pageSize>5</pageSize><eid>${this.dataOptions.eid}</eid><searchtype>WO</searchtype><searchtext>${this.worDetails[woIndex].WONUMBER}</searchtext><searchstatus>${this.dataOptions.searchstatus}</searchstatus></Info>`.trim();
      this.OdsSvc.GetWorkOrderStatus(searchOptions).subscribe(Response => {
        this.paceEnv.stopLoading();
        if (Response.status === 200) {
          let body = JSON.parse(Response._body);

          if (body[0].result === '') {
            this.woqEmpty();
            this.infinitescrollactions(false, false, true);
          } else {
            let result = JSON.parse(body[0].result);
            console.log('workorder', result);
            result.forEach((element, index) => {
              element.expanded = false;
              element.selectedPackege = 0;
              element.UniquePackeges = [...this.getPackeges(element)];
              element.filterPackeges = [];
              element.WOSERVICES.forEach((ws: any) => {
                ws.expanded = false;
                ws.value = '0';
              });
              if (element.SUBWORKORDER.length > 0) {
                element.SUBWORKORDER.forEach(subOrder => {
                  subOrder.WOSERVICES.forEach((ws: any) => {
                    ws.expanded = false;
                    ws.empid = '0';
                  });
                });

              }
              this.worDetails[woIndex] = result[0];
              this.worDetails.forEach((selectOd, odIndex) => {
                this.changeDetectorRef.detectChanges();
                this.selectedPackege(odIndex, selectOd.UniquePackeges[0]);
              });

            });
            this.infinitescrollactions(true, false, false);
            this.woqEmpty();
          }
        } else {
          this.woqEmpty();
        }
      }, (err) => {
        console.log('get order err', err);
        this.paceEnv.stopLoading();
        this.woqEmpty();
      });
    }
    });
    Modal.present().then(val => {
      // this.paceEnv.startLoading();
      // this.workOrders = [];
      // this.getWorkOrders();
      // loader.dismiss();
      
    }).catch(err => {
      console.log(err);
      this.paceEnv.stopLoading();
    });
  
  }


  getPackeges(workOrder: any) {
    let newArray = workOrder.WOSERVICES.reduce(
      (accumulator, current) => accumulator.some(x => x.PACKAGENAME === current.PACKAGENAME) ? accumulator : [...accumulator, current], []
    );
    return newArray;
  }

  woqEmpty() {    
    if (this.worDetails.length == 0) {
      this.worDetails = 'No Data Found';
    }
  }

  selectedPackege(workOderIndex, packege, woSindex = 0) {
    //console.log('woSindex', workOderIndex,packege);
    //let loader = this.loadingSrv.createLoader();
    //loader.present();
    
    this.worDetails[workOderIndex].selectedPackege = woSindex;
    this.worDetails[workOderIndex].filterPackeges = this.worDetails[workOderIndex].WOSERVICES.filter(data => {
      //loader.dismiss();
      return data.SSIID == packege.SSIID;
      
    });
  
  }
  
  /**
   * 
   * @param complete isinfinitescroll completed
   * @param enable  isinfinitescroll enable
   * @param disable isinfinitescroll disable
   */
  infinitescrollactions(complete: boolean, enable: boolean, disable: boolean) {
    if (this.addinfinitescroll == true) {
      (complete == true) ? this.infintescrollevent.complete() : (enable == true) ? this.infintescrollevent.enable(true) : (disable == true) ? this.infintescrollevent.enable(false) : ' ';
    }
  }


  getAssigmentlist() {
    let self = this;
    this.empListModel =[];
    this.paceEnv.startLoading();
   // let loader = this.loadingSrv.createLoader();
   // loader.present();
    this.OdsSvc.getAssignmentEmployeeList(this.dataOptions).subscribe(Response => {
     // loader.dismiss();
      this.paceEnv.stopLoading();
      if (Response[0].result !== '') {
        let result = JSON.parse(Response[0].result);
        self.emplist = result[0].EMPLOYEES;
        for(let i= 0; i <self.emplist.length; i++  ){
        this.empListModel.push({name:self.emplist[i].NAME,value:self.emplist[i].EID})
        }
        console.log("Emp modal :",this.empListModel);
        
        self.employeeWorkOrderPermissionforactions();
        //self.getWorkOrders();
      }
    }, (err) => {
      console.log('err', err);
    })
  }


  employeeWorkOrderPermissionforactions() {
    let self = this;
    //this.paceEnv.startLoading();
    this.OdsSvc.employeeWorkOrderPermissionforactions(this.dataOptions).subscribe(Response => {
      //this.paceEnv.stopLoading();
      if (Response[0].result !== '') {
        let result = JSON.parse(Response[0].result);
        //self.getWorkOrders("L");
        self.workOrderPermission = Object.assign({}, result[0].WOPERMISSIONS[0]);        
      }
      
    }, (err) => {
      console.log('err', err);
      
    });
  }


  getWorkOrders(woCompeltedIndex) {
   
    this.paceEnv.startLoading();
    let searchOptions: string = `<Info><siteid>${this.dataOptions.siteid}</siteid><pageNumber>${this.dataOptions.pageNumber}</pageNumber><pageSize>${this.dataOptions.pageSize}</pageSize><eid>${this.dataOptions.eid}</eid><searchtype>${this.dataOptions.searchtype}</searchtype><searchtext>${this.dataOptions.searchtext}</searchtext><searchstatus>${this.dataOptions.searchstatus}</searchstatus></Info>`.trim();
    this.OdsSvc.GetWorkOrderStatus(searchOptions).subscribe(Response => {
      console.log('getworkOrder Queue', Response);
  this.paceEnv.stopLoading();
  if (Response.status === 200) {
    let body = JSON.parse(Response._body);
    //console.log(body);

        if (body[0].result === '') {
          this.woqEmpty();
          this.infinitescrollactions(false, false, true);
        } else {
          let result = JSON.parse(body[0].result);
          console.log(result, this.emplogtype, 'vv');
          if(woCompeltedIndex == "L"){
          result.forEach((element, index) => {
            element.expanded = false;
            element.selectedPackege = 0;
            element.UniquePackeges = [...this.getPackeges(element)];
            element.filterPackeges = [];
            element.WOSERVICES.forEach((ws: any) => {
              ws.expanded = false;
              ws.value = '0';
            });
            if (element.SUBWORKORDER.length > 0) {
              element.SUBWORKORDER.forEach(subOrder => {
                subOrder.WOSERVICES.forEach((ws: any) => {
                  ws.expanded = false;
                  ws.empid = '0';
                });
              });

            }

            this.worDetails.push(Object.assign({}, element));

            this.worDetails.forEach((selectOd, odIndex) => {
              this.changeDetectorRef.detectChanges();
              this.selectedPackege(odIndex, selectOd.UniquePackeges[0]);

            });
          });
        }else{
          result.forEach((element, woCompeltedIndex) => {
            element.expanded = false;
            element.selectedPackege = 0;
            element.UniquePackeges = [...this.getPackeges(element)];
            element.filterPackeges = [];
            element.WOSERVICES.forEach((ws: any) => {
              ws.expanded = false;
              ws.value = '0';
            });
            if (element.SUBWORKORDER.length > 0) {
              element.SUBWORKORDER.forEach(subOrder => {
                subOrder.WOSERVICES.forEach((ws: any) => {
                  ws.expanded = false;
                  ws.empid = '0';
                });
              });
              
            }
            ///this.workOrders.push(Object.assign({}, element));
            
           // console.log('test',element);
            this.worDetails[woCompeltedIndex]=element;
            this.worDetails.forEach((selectOd, odIndex) => {
              this.changeDetectorRef.detectChanges();
              this.selectedPackege(odIndex, selectOd.UniquePackeges[0]);

            });
          });

        }
          this.infinitescrollactions(true, false, false);
          this.woqEmpty();
        }
        console.log('workorder end', this.worDetails,woCompeltedIndex);

      } else {
        this.woqEmpty();
      }
    }, (err) => {
      console.log('get order err', err);
      this.paceEnv.stopLoading();
      this.woqEmpty();
    });
  }


  pickService(serviceobj, woMainIndex,woindex, serviceindex, action,subWorkorder) {
    let self = this;
    let alertMsg = action == 'D' ? "Are you sure you want to Cancel your pickup?" : action == 'P' ? "Are you sure you want to Pickup service?" : "Are you sure you want to Complete?"
    let alert = this.alert.create({
      message: alertMsg,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            let servive: any = {
              action: action,
              empid: this.dataOptions.eid,
              eidlogtype: this.emplogtype,
              serid: serviceobj.WOSID,
              ip: this.paceEnv.ipAddress,
              isscanned: 'N'
            };
            let loader = this.loadingSrv.createLoader();
            loader.present();
            self.OdsSvc.pickUpService(servive).subscribe(Response => {
            loader.dismiss();
              if (Response[0].status > 0) {
                self.OdsSvc.refreshServiceItems(servive.serid).subscribe(serviceres => {
                  if (serviceres[0].result !== '') {
                    let result = JSON.parse(serviceres[0].result);
                    console.log('serviceres1', result[0].SERVICEITEM[0]);
                    console.log('index',woMainIndex,serviceindex,woindex, action);

                    this.worDetails.filterPackeges[serviceindex] = Object.assign({}, result[0].SERVICEITEM[0]);
                    this.worDetails.WOSERVICES[serviceindex] = result[0].SERVICEITEM[0];
                    this.serviceUpdatedObj = result[0].SERVICEITEM[0];   
                  }
                }, (err) => {
                  //self.paceEnv.stopLoading();
                  loader.dismiss();
                  console.log('err', err);
                })
              } else {
                loader.dismiss();
                //self.paceEnv.stopLoading();
              }
            }, (err) => {
              loader.dismiss();
              //this.paceEnv.stopLoading();
              console.log('err', err);
            })
          }
        }
      ]
    });
    alert.present();
  }

  empSelectionUpdate(woService, woIndex, serviceIndex, empId, subWorkorder, subWoindex) {
    console.log('emp update', woService, woIndex, serviceIndex, empId);
    if (this.selectpackege == true) {
      this.selectpackege = false;
    } else {
      if (woService.empId !== '0') {
        woService.empid = empId;
        this.assigment(woService, empId,woIndex, serviceIndex, subWorkorder, subWoindex);
      } else {
        this.presentToast('Select employee', 'bottom');
      }
    }
  }


  empSelection(woService,selcEmpId, woIndex, serviceIndex, subWorkorder, subWoindex) {
    if (this.selectpackege == true) {
      this.selectpackege = false;
    } else {
      if (selcEmpId !== '0') {
        
        //console.log(selcEmpId);
        this.assigment(woService,selcEmpId, woIndex, serviceIndex, subWorkorder, subWoindex);
      } else {
        this.presentToast('Select employee', 'bottom');
      }
    }

  }

  assigment(woservice,selectedEmpid, woindex, serviceindex, subWorkorder, subWoindex) {
    //let self = this;   
     console.log('testggggggggggg',woservice,selectedEmpid, woindex, serviceindex, subWorkorder, subWoindex);

    let servive: any = {
      eid       : this.dataOptions.eid,
      assigneid : selectedEmpid,
      eidlogtype: this.emplogtype,
      serid     : woservice.WOSID,
      ip        : this.paceEnv.ipAddress,
      isscanned : 'N',
      assignelogtype: 1,
      action    : 'A'
    };
    this.paceEnv.startLoading();
    console.log(subWorkorder);
    
    this.OdsSvc.assignWOItem(servive).subscribe(Response => {
      if (Response[0].errorId > 0 ) {
        console.log(Response);
        this.OdsSvc.refreshServiceItems(servive.serid).subscribe(serviceres => {
          this.paceEnv.stopLoading();
          if (serviceres[0].result !== '') {
            let result = JSON.parse(serviceres[0].result);
            console.log("Assign to :",result);
            console.log('sub workorder', subWorkorder);
            
            this.worDetails.WOSERVICES[serviceindex] = result[0].SERVICEITEM[0];
            this.serviceUpdatedObj = result[0].SERVICEITEM[0];
          }
        }, (err) => {
          this.paceEnv.stopLoading();
          console.log('err', err);
        })
      }
    }, (err) => {
      this.paceEnv.stopLoading();
      console.log('err', err);
    });
  }


  presentToast(mgs, position) {
    let toast = this.toastCtrl.create({
      message: mgs,
      duration: 1500,
      position: position
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }
}
