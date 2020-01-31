import { Component, ChangeDetectorRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { DatabaseProvider } from '../../providers/database/database';
import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';
import moment from 'moment';
import { FeedBackComponent } from '../../components/feed-back/feed-back';

/**
 * Generated class for the WorkorderQueuePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage(
  { name: "page-workorderqueue" }
)
@Component({
  selector: 'page-workorder-queue',
  templateUrl: 'workorder-queue.html',
})
export class WorkorderQueuePage {
  public workOrders: any = [];
  public currentWoQ: any;
  public previousIndex: any;
  public NoImg: string = "../../assets/imgs/workorderqueue/no-user-image.png";
  public pageSize = 20;
  public dataOptions: any = {
    siteid: 3269,
    pageNumber: 1,
    pageSize: 20,
    eid: 1,
    searchtext: '',
    searchstatus: 'A',
    searchtype: 0
  }
  addinfinitescroll: boolean = false;
  infintescrollevent: any;
  selectemp = {
    value: '0'
  }
  emplist: any = [];
  emplogtype: any = 'C';
  loggedEmp: any = '';
  workOrderPermission: any;
  woservice: any = {
  };
  selectpackege: boolean = false;
  // serviceIndex: any;
  headerName: any;
  PageNo: any;
  
  dataOptionsText:any = "0";
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public OdsSvc: OdsServiceProvider,
    public paceEnv: PaceEnvironment,
    public modalctrl: ModalController,
    public db: DatabaseProvider,
    public alert: AlertController,
    private loadingSrv: LoadingServiceProvider,
    public toastCtrl: ToastController,
    public changeDetectorRef:ChangeDetectorRef) {
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
      this.paceEnv.startLoading();
      this.getAssigmentlist();
    });
    this.PageNo = this.navParams.get('itm');
    console.log('PageName.....', this.PageNo);
    if(this.PageNo == 1){
    this.dataOptions.searchstatus = 'E';
    }

  }
  dataOptionsModel=[{name:'VIN #',value:'V'},{name:'Stock #',value:'S'},{name:'Work Order #',value:'WO'}];
  empListModel:any[] = [];
  selectedEmpId:string = "0";
  selectOptions:true;
  dataSearchModel=[{name:'Active Work Orders',value:'A'},{name:'Open',value:'O'},{name:'In-Progress',value:'I'},{name:'Completed',value:'C'},{name:'Exception Work Orders',value:'E'}];

  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkorderQueuePage');
  }

  expand(wo, i, serviceIndex, toggle) {
    this.workOrders[i].expanded = toggle;
    this.workOrders.map((listItem, index) => {
      if (index == i) {
        this.workOrders[i].expanded = toggle;
      } else {
        listItem.expanded = false;
      }
      return listItem;
    });
  }

  getWorkOrders() {
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
            this.workOrders.push(Object.assign({}, element));
            this.workOrders.forEach((selectOd, odIndex) => {
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


  search() {
    this.paceEnv.startLoading();
    this.workOrders = [];
    this.infinitescrollactions(false, false, true);
    this.infinitescrollactions(false, true, false);
    this.dataOptions.pageNumber = 1;
    this.dataOptions.pageSize = this.pageSize;
    //this.getWorkOrders();
    this.getAssigmentlist();
  }


  cancel() {
    this.paceEnv.startLoading();
    this.infinitescrollactions(false, false, true);
    this.infinitescrollactions(false, true, false);
    this.dataOptions.searchtype = 0;
    this.dataOptions.searchstatus = 'A';
    this.dataOptions.searchtext = '';
    this.dataOptions.pageNumber = 1;
    this.dataOptions.pageSize = this.pageSize;
    this.workOrders = [];
    this.dataOptionsText = "0";
    this.getWorkOrders();
  }


  doInfinite($event) {
    console.log('infinite scroll', this.workOrders);
    this.addinfinitescroll = true;
    this.infintescrollevent = $event;
    this.dataOptions.pageNumber = this.dataOptions.pageNumber + 1;
    this.dataOptions.pageSize = this.pageSize;
    this.getWorkOrders();
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


  woqEmpty() {
    if (this.workOrders.length == 0) {
      this.workOrders = 'No Data Found';
    }
  }


  edit(wo, i, action) {
    let loader = this.loadingSrv.createLoader();
    loader.present();
    let Modal = this.modalctrl.create('ModalpagePage', { workOrderObj: wo, action: action }, { cssClass: "full-height-modal" });
    Modal.onDidDismiss(data => {
      if (String(data) !== 'undefined') {
        if (action != 'edit') {
          this.dataOptions.pageNumber = 1;
          this.dataOptions.pageSize = this.workOrders.length;
          this.workOrders = [];
          this.getWorkOrders();
        } else {
          this.workOrders[i] = Object.assign({}, data.woorder);
        }
      }
    });
    Modal.present().then(val => {
      loader.dismiss();
    }).catch(err => {
      console.log(err);
      loader.dismiss();
    });;

  }
  exceptionFixes(woid, deptname, deptid) {
    console.log('response exceptionFixes', this.workOrders, woid, deptname, deptid);
    let type = 'woexp';
    let Modal = this.modalctrl.create('TestPage', { 'Data': woid, 'type': type, 'DeptName': deptname, 'DeptId': deptid }, { cssClass: "full-height-modal" });
    Modal.onDidDismiss((data) => {
      if(data == "Success"){
        setTimeout(() => {
          this.paceEnv.startLoading();
          this.workOrders = [];
          this.getWorkOrders();  
        }, 2000);
        this.paceEnv.stopLoading();
      }else{
        
      }
      //this.ViewCtrl.dismiss();
      console.log('in workorderqueu page');
      //this.workOrders = [];
      //this.getWorkOrders();
    });
    Modal.present();
  }
  NotesModal(notes, wo, notetype, woIndex) {
    console.log('subworkorder note', notes, wo, notetype);
    // let loader = this.loadingSrv.createLoader();
    // loader.present();
    let Modal = this.modalctrl.create('TestPage', { 'type': notes, 'Wodata': wo, 'NType': notetype }, { cssClass: "full-height-modal" });
    Modal.onDidDismiss((val) => {
      //this.ViewCtrl.dismiss();
      if(val==1){
      this.paceEnv.startLoading();
      console.log('in workorderqueu page');
      let searchOptions: string = `<Info><siteid>${this.dataOptions.siteid}</siteid><pageNumber>1</pageNumber><pageSize>5</pageSize><eid>${this.dataOptions.eid}</eid><searchtype>WO</searchtype><searchtext>${this.workOrders[woIndex].WONUMBER}</searchtext><searchstatus>${this.dataOptions.searchstatus}</searchstatus></Info>`.trim();
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
              this.workOrders[woIndex] = result[0];
              this.workOrders.forEach((selectOd, odIndex) => {
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
      this.paceEnv.startLoading();
    });
  
  }

  empSelection(woService,selcEmpId, woIndex, serviceIndex, subWorkorder = false, subWoindex = 0) {
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
  empSelectionUpdate(woService, woIndex, serviceIndex, empId, subWorkorder = false, subWoindex = 0) {
    console.log('emp update', woService, woIndex, serviceIndex, empId);
    if (this.selectpackege == true) {
      this.selectpackege = false;
    } else {
      if (empId !== '0') {
        woService.empid = empId;
        this.assigment(woService, empId,woIndex, serviceIndex, subWorkorder, subWoindex);
      } else {
        this.presentToast('Select employee', 'bottom');
      }
    }


  }

  getlength(ex, list) {
    let newlist = list.filter((x: any) => { return x.TYPE === ex; })
    return newlist.length;
  }

  getAssigmentlist() {
    let self = this;
    this.OdsSvc.getAssignmentEmployeeList(this.dataOptions).subscribe(Response => {
      if (Response[0].result !== '') {
        let result = JSON.parse(Response[0].result);
        self.emplist = result[0].EMPLOYEES;
        for(let i= 0; i <self.emplist.length; i++  ){
        this.empListModel.push({name:self.emplist[i].NAME,value:self.emplist[i].EID})
        }
        //console.log(this.empListModel);
        
        self.employeeWorkOrderPermissionforactions();
      }
    }, (err) => {
      console.log('err', err);
    })
  }

  assigment(woservice,selectedEmpid, woindex, serviceindex, subWorkorder = false, subWoindex = 0) {
    let self = this;
    let servive: any = {
      eid: this.dataOptions.eid,
      assigneid: selectedEmpid,
      eidlogtype: this.emplogtype,
      serid: woservice.WOSID,
      ip: this.paceEnv.ipAddress,
      isscanned: 'N',
      assignelogtype: 1,
      action: 'A'
    };
    this.paceEnv.startLoading();
    this.OdsSvc.assignWOItem(servive).subscribe(Response => {
      if (Response[0].errorId > 0 ) {
        console.log(Response);
        self.OdsSvc.refreshServiceItems(servive.serid).subscribe(serviceres => {
          this.paceEnv.stopLoading();
          if (serviceres[0].result !== '') {
            let result = JSON.parse(serviceres[0].result);
            console.log('sub workorder', subWorkorder);
            if (subWorkorder == true) {
              console.log('sub workorder true', subWorkorder);
              self.workOrders[woindex].SUBWORKORDER[subWoindex].WOSERVICES[serviceindex] = Object.assign({}, result[0].SERVICEITEM[0]);
            } else {
              console.log('sub workorder else', subWorkorder);
              // self.workOrders[woindex].SUBWORKORDER[0].WOSERVICES[serviceindex] = Object.assign({}, result[0].SERVICEITEM[0]);
              console.log('sub workorder ', subWorkorder);
              let woserviceindex = self.workOrders[woindex].WOSERVICES.findIndex(service => {
                return service.WOSID === woservice.WOSID
              });
              self.workOrders[woindex].WOSERVICES[woserviceindex] = Object.assign({}, result[0].SERVICEITEM[0]);
              self.workOrders[woindex].filterPackeges[serviceindex] = Object.assign({}, result[0].SERVICEITEM[0]);
              let packegeindex = self.workOrders[woindex].UniquePackeges.findIndex(p => {
                return p.SSIID === self.workOrders[woindex].filterPackeges[serviceindex].SSIID;
              })
              self.workOrders[woindex].selectedPackege = packegeindex;
            }

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



  pickService(serviceobj, woindex, serviceindex, action) {
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
            self.paceEnv.startLoading();
            self.OdsSvc.pickUpService(servive).subscribe(Response => {
              if (Response[0].status > 0) {
                self.OdsSvc.refreshServiceItems(servive.serid).subscribe(serviceres => {
                  if (serviceres[0].result !== '') {
                    // let result = JSON.parse(serviceres[0].result);
                    // console.log('serviceres1', result[0].SERVICEITEM[0],serviceobj, woindex, serviceindex, action);
                    // self.workOrders[woindex].WOSERVICES[serviceindex] =Object.assign({},result[0].SERVICEITEM[0]);
                    console.log('emp data empid, this.emplogtype', self.dataOptions.eid, self.emplogtype);
                    self.workOrders = [];
                    self.paceEnv.stopLoading();
                    self.paceEnv.startLoading();
                    self.getWorkOrders();
                    // if(action=='D')
                    //   self.workOrders[woindex].WOSERVICES[serviceindex].empid = "--Select--";

                    // if (action == 'C') {
                    //   if(self.workOrders[woindex].WOSERVICES.length>1)
                    //   self.workOrders[woindex].WOSERVICES.splice(serviceindex, 1);
                    //   else
                    //   self.workOrders.splice(woindex, 1);
                    // }
                  }
                }, (err) => {
                  self.paceEnv.stopLoading();
                  console.log('err', err);
                })
              } else {
                self.paceEnv.stopLoading();
              }
            }, (err) => {
              this.paceEnv.stopLoading();
              console.log('err', err);
            })
          }
        }
      ]
    });
    alert.present();
  }


  employeeWorkOrderPermissionforactions() {
    let self = this;
    this.OdsSvc.employeeWorkOrderPermissionforactions(this.dataOptions).subscribe(Response => {
      if (Response[0].result !== '') {
        let result = JSON.parse(Response[0].result);
        self.workOrderPermission = Object.assign({}, result[0].WOPERMISSIONS[0]);
        console.log('Permissions',self.workOrderPermission);
        
       self.getWorkOrders();
      }
    }, (err) => {
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

  selectedPackege(workOderIndex, packege, woSindex = 0) {
    console.log('woSindex', woSindex);
    this.workOrders[workOderIndex].selectedPackege = woSindex;
    this.workOrders[workOderIndex].filterPackeges = this.workOrders[workOderIndex].WOSERVICES.filter(data => {
      return data.SSIID == packege.SSIID;
    });
  }
  getPackeges(workOrder: any) {
    let newArray = workOrder.WOSERVICES.reduce(
      (accumulator, current) => accumulator.some(x => x.PACKAGENAME === current.PACKAGENAME) ? accumulator : [...accumulator, current], []
    );
    return newArray;
  }
  valueChange(selectedemp, xxxx,spackage, i, serviceindex, subWorkorder = false, subWoindex = 0) {
    console.log('selectedemp', selectedemp, spackage, i, serviceindex);
    spackage.empid = selectedemp.empid;
    if (selectedemp.type == 'NEW')
      this.empSelection(spackage,xxxx, i, serviceindex, subWorkorder, subWoindex);
    if (selectedemp.type == 'UPDATE')
      this.empSelectionUpdate(spackage, i, serviceindex, spackage.empid, subWorkorder, subWoindex);
  }

  selectDataOpt(data){
           // console.log(data);
            
       this.dataOptions.searchtype = data;
       
  }
  ApproveClick(wo,i,approve){
    let date = moment(new Date()).format('MM/DD/YYYY');////changed by Vishnu
    let time = moment(new Date()).format('hh:mm A');////changed by Vishnu;
    console.log(wo);
    
    let paramObj = {strWoId :wo.WOID,strApprovedBy:this.loggedEmp, strApprovedDt:date,strApprovedTime:time,strIPAddress:this.paceEnv.ipAddress }
    console.log(paramObj);
    //this.paceEnv.startLoading();
    this.OdsSvc.approveAdmin(paramObj).subscribe((approveData:any)=>{
      if(approveData[0].errorId > 0){
        setTimeout(() => {
          this.paceEnv.startLoading();
          this.workOrders = [];
          this.getWorkOrders();  
        }, 2000);
        this.paceEnv.stopLoading();
      }   
    })

  }

  onClick(rating,list){
    let date = moment(new Date()).format('MM/DD/YYYY');////changed by Vishnu
    let time = moment(new Date()).format('hh:mm A');////changed by Vishnu;
   let SearchString ="";
   let body:any ='';
    list.RATING = rating;
    SearchString =`<WORating>
    <ratingId>${list.WONUMBER}</ratingId>
    <ratingValue>${rating}</ratingValue>
    <ratingAcceptedById>${this.loggedEmp}</ratingAcceptedById>
    <ratingAcceptedDate>${date}</ratingAcceptedDate>
    <ratingAcceptedTime>${time}</ratingAcceptedTime>
  </WORating>`
   this.OdsSvc.fiveStarRating(SearchString).subscribe((fiveStarData:any)=>{
     body = JSON.parse(fiveStarData._body);
     
     if(body[0].errorId > 0){
      setTimeout(() => {
        this.paceEnv.startLoading();
        this.workOrders = [];
        this.getWorkOrders();  
      }, 2000);
      this.paceEnv.stopLoading();

     }
   })
    console.log(rating,list)
  }
  openFeedBack(woList){
    console.log(woList);
    if(woList.RATING == "0"){
          this.paceEnv.ShowAlert("Please Enter Rating ");
    }else{
      let loader = this.loadingSrv.createLoader();
    loader.present();
    let Modal = this.modalctrl.create(FeedBackComponent, {workOrderObj: woList,logged:this.loggedEmp,type:'feedBack' }, { cssClass: "full-height-modal" });
    Modal.present().then(val => {
      loader.dismiss();
    }).catch(err => {
      console.log(err);
      loader.dismiss();
    });;
  }
    
  }
  
  
}
