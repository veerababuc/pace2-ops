import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, ToastController } from 'ionic-angular';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { DatabaseProvider } from '../../providers/database/database';
import { LoadingServiceProvider } from '../../providers/loading-service/loading-service';
import moment from 'moment';
import { FeedBackComponent } from '../../components/feed-back/feed-back';
import { NativeStorage } from '@ionic-native/native-storage';

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
  public cloneWorkOrders: any = [];
  public currentWoQ: any;
  public previousIndex: any;
  public NoImg: string = "../../assets/imgs/workorderqueue/no-user-image.png";
  public pageSize = 20;
  public dataOptions: any = {
    siteid: 0,
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
    public changeDetectorRef:ChangeDetectorRef,
    private zone: NgZone,private storage:NativeStorage) {

      this.paceEnv.startLoading();
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
      
 this.storage.getItem('ops_userlist').then(data =>{
  console.log('data123',data)
  this.employeeWorkOrderPermissionforactions();
  if(data.length > 0){
    this.empListModel = data;
  }else{
    this.getAssigmentlist();
  }
},error=>{
  this.employeeWorkOrderPermissionforactions();
this.getAssigmentlist();
})
      //this.paceEnv.startLoading();
      //this.getAssigmentlist();
      
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

  getWorkOrders(woCompeltedIndex) {
    // if(searchText == ''){
    //   this.dataOptions.searchtext = searchText;
    // }
    // else{
    //   this.dataOptions.searchtext = searchText;
    // }
   // this.paceEnv.startLoading();
    let searchOptions: string = `<Info><siteid>${this.dataOptions.siteid}</siteid><pageNumber>${this.dataOptions.pageNumber}</pageNumber><pageSize>${this.dataOptions.pageSize}</pageSize><eid>${this.dataOptions.eid}</eid><searchtype>${this.dataOptions.searchtype}</searchtype><searchtext>${this.dataOptions.searchtext}</searchtext><searchstatus>${this.dataOptions.searchstatus}</searchstatus></Info>`.trim();
    this.OdsSvc.GetWorkOrderStatus(searchOptions).subscribe(Response => {
      console.log('getworkOrder Queue', Response);
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
            this.workOrders.push(Object.assign({}, element));
            this.workOrders.forEach((selectOd, odIndex) => {
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
            this.workOrders[woCompeltedIndex]=element;
            this.workOrders.forEach((selectOd, odIndex) => {
              this.changeDetectorRef.detectChanges();
              this.selectedPackege(odIndex, selectOd.UniquePackeges[0]);

            });
          });

        }
          this.infinitescrollactions(true, false, false);
          this.woqEmpty();
        }
        console.log('workorder end', this.workOrders,woCompeltedIndex);
        this.paceEnv.stopLoading();
  
      } else {
        this.woqEmpty();
        this.paceEnv.stopLoading();
  
      }
    }, (err) => {
      console.log('get order err', err);
      this.paceEnv.stopLoading();
      this.woqEmpty();
    });
  }


  search() {
   // this.paceEnv.startLoading();
    this.workOrders = [];
    this.infinitescrollactions(false, false, true);
    this.infinitescrollactions(false, true, false);
    this.dataOptions.pageNumber = 1;
    this.dataOptions.pageSize = this.pageSize;
    this.getWorkOrders('L');
    //this.getAssigmentlist();
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
    this.getWorkOrders("L");
  }


  doInfinite($event) {
    console.log('infinite scroll', this.workOrders);
    this.addinfinitescroll = true;
    this.infintescrollevent = $event;
    this.dataOptions.pageNumber = this.dataOptions.pageNumber + 1;
    this.dataOptions.pageSize = this.pageSize;
    this.getWorkOrders("L");
    //this.cloneGetWorkOrders();
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
        //console.log(action);
        
        if (action == 'addparts') {
          this.dataOptions.pageNumber = 1;
          this.dataOptions.pageSize = this.workOrders.length;
          //this.workOrders = [];
          //this.getWorkOrders();
          this.cloneGetWorkOrders(i);
          //this.getWorkOrders(i);
        } else if(action == "void") {
           this.workOrders.splice(i,1);
        }else{
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
  exceptionFixes(woid, deptname, deptid,index) {
    console.log('response exceptionFixes', this.workOrders, woid, deptname, deptid);
    let type = 'woexp';
    let Modal = this.modalctrl.create('21', { 'Data': woid, 'type': type, 'DeptName': deptname, 'DeptId': deptid }, { cssClass: "full-height-modal" });
    Modal.onDidDismiss((data) => {
      this.paceEnv.startLoading();
      if(data == "Success"){
        setTimeout(() => {         
          this.workOrders = [];
          this.getWorkOrders("L");  
          //this.cloneGetWorkOrders(index)
        }, 2000);
        this.paceEnv.stopLoading();
      }else{
        this.paceEnv.stopLoading();
      }
      //this.ViewCtrl.dismiss();
      console.log('in workorderqueu page');
      //this.workOrders = [];
      //this.getWorkOrders();
    });
    Modal.present();
  }
  NotesModal(notes, wo, notetype, woIndex,SId) {
    console.log('subworkorder note', notes, wo, notetype,SId);
    // let loader = this.loadingSrv.createLoader();
    // loader.present();
    let Modal = this.modalctrl.create('TestPage', { 'type': notes, 'Wodata': wo, 'NType': notetype, 'SId':SId }, { cssClass: "full-height-modal" });
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
            this.paceEnv.stopLoading();
          }
        } else {
          this.woqEmpty();
          this.paceEnv.stopLoading();
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
        self.emplist.filter(item=>{
          this.empListModel.push({name:item.NAME ,value:item.EID})
        })
        // for(let i= 0; i <self.emplist.length; i++  ){
        // this.empListModel.push({name:self.emplist[i].NAME ,value:self.emplist[i].EID})
        // }

      //   this.empListModel.sort(function(a, b) {
      //     var nameA = a.name.toUpperCase();
      //     var nameB = b.name.toUpperCase();
      //     return (nameA < nameB) ? -1 : (nameA > nameB) ? 1 : 0;
      // });

        console.log(this.empListModel);
        
      //  self.employeeWorkOrderPermissionforactions();
        this.storage.setItem('ops_userlist',this.empListModel).then(()=>{});
        //self.getWorkOrders();
      }
    }, (err) => {
      console.log('err', err);
    })
  }



  assigment(woservice,selectedEmpid, woindex, serviceindex, subWorkorder, subWoindex) {
    //let self = this;   
     console.log('testggggggggggg',woservice,selectedEmpid, woindex, serviceindex, subWorkorder, subWoindex);

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
    console.log(subWorkorder);
    
    this.OdsSvc.assignWOItem(servive).subscribe(Response => {
      if (Response[0].errorId > 0 ) {
        console.log(Response);
        this.OdsSvc.refreshServiceItems(servive.serid).subscribe(serviceres => {
          this.paceEnv.stopLoading();
          if (serviceres[0].result !== '') {
            let result = JSON.parse(serviceres[0].result);
            console.log('sub workorder', subWorkorder);
            if (subWorkorder == true) {
            //if (subWorkorder != "0") {
              //this.workOrders[woindex].SUBWORKORDER[serviceindex].WOSERVICES[serviceindex] = result[0].SERVICEITEM[0];
              console.log('sub workorder true', serviceindex,woindex);
              //this.workOrders[woindex].WOSERVICES[serviceindex] =  result[0].SERVICEITEM[0];
              //this.workOrders[woindex].filterPackeges[serviceindex] =  result[0].SERVICEITEM[0];
              //this.workOrders[woindex].filterPackeges[serviceindex]="Vishnu"
              //this.workOrders[woindex].WOSERVICES[serviceindex] = JSON.stringify(result[0].SERVICEITEM[0]);
              //this.workOrders[woindex].WOSERVICES[serviceindex] =  result[0].SERVICEITEM[0];
              // setTimeout(() => {
              //   this.paceEnv.startLoading();
              //   this.workOrders = [];
              //   this.getWorkOrders();  
              // }, 2000);
              // this.paceEnv.stopLoading();
              //this.employeeWorkOrderPermissionforactions();
              let arry = JSON.stringify(result[0].SERVICEITEM[0])
              this.zone.run(() => { this.workOrders[woindex].SUBWORKORDER[subWoindex].WOSERVICES[serviceindex] =  JSON.parse(arry)});
              console.log("Vishnu",this.workOrders);
              console.log(result[0].SERVICEITEM[0]);
              
            } else {

              console.log('sub workorder else', subWorkorder);
              // self.workOrders[woindex].SUBWORKORDER[0].WOSERVICES[serviceindex] = Object.assign({}, result[0].SERVICEITEM[0]);
              console.log('sub workorder ', subWorkorder);
              let woserviceindex = this.workOrders[woindex].WOSERVICES.findIndex(service => {
                return service.WOSID === woservice.WOSID
              });
              
              this.workOrders[woindex].WOSERVICES[woserviceindex] =  result[0].SERVICEITEM[0];
              this.workOrders[woindex].filterPackeges[serviceindex] =  result[0].SERVICEITEM[0];
              // let packegeindex = this.workOrders[woindex].UniquePackeges.findIndex(p => {
              //   return p.SSIID === this.workOrders[woindex].filterPackeges[serviceindex].SSIID;
              // })
              //this.workOrders[woindex].selectedPackege = packegeindex;
              console.log('Vishnu1',this.workOrders);
              
              // setTimeout(() => {
              //   this.paceEnv.startLoading();
              //   this.workOrders = [];
              //   this.getWorkOrders(this.dataOptions.searchtext);  
              // }, 2000);
              // this.paceEnv.stopLoading();
              
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



  // pickService(serviceobj, woindex, serviceindex, action,subWorkorder) {
  //   let self = this;
  //   let alertMsg = action == 'D' ? "Are you sure you want to Cancel your pickup?" : action == 'P' ? "Are you sure you want to Pickup service?" : "Are you sure you want to Complete?"
  //   let alert = this.alert.create({
  //     message: alertMsg,
  //     buttons: [
  //       {
  //         text: 'Cancel',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('Cancel clicked');
  //         }
  //       },
  //       {
  //         text: 'OK',
  //         handler: () => {
  //           let servive: any = {
  //             action: action,
  //             empid: this.dataOptions.eid,
  //             eidlogtype: this.emplogtype,
  //             serid: serviceobj.WOSID,
  //             ip: this.paceEnv.ipAddress,
  //             isscanned: 'N'
  //           };
  //           let loader = this.loadingSrv.createLoader();
  //           loader.present();
  //           self.OdsSvc.pickUpService(servive).subscribe(Response => {
  //           loader.dismiss();
  //             if (Response[0].status > 0) {
  //               self.OdsSvc.refreshServiceItems(servive.serid).subscribe(serviceres => {
  //                 if (serviceres[0].result !== '') {
  //                   let result = JSON.parse(serviceres[0].result);
  //                   console.log('serviceres1', result[0].SERVICEITEM[0]);
  //                   console.log('index',woindex, serviceindex, action)
  //                   if(subWorkorder  == true){
  //                     this.workOrders[woindex].SUBWORKORDER[serviceindex].WOSERVICES[serviceindex]= Object.assign({},result[0].SERVICEITEM[0]);
  //                     this.selectedEmpId="0";
  //                     }else{
  //                    this.workOrders[woindex].filterPackeges[serviceindex] =Object.assign({},result[0].SERVICEITEM[0]);
  //                    this.zone.run(() => { this.workOrders[woindex].filterPackeges[serviceindex] =Object.assign({},result[0].SERVICEITEM[0])});
  //                     }
  //                    //this.employeeWorkOrderPermissionforactions("");
  //                   //  if(subWorkorder  == true){
  //                   //  this.workOrders[woindex].SUBWORKORDER[serviceindex].WOSERVICES[serviceindex]= Object.assign({},result[0].SERVICEITEM[0]);
  //                   //  }
  //                   console.log('emp data empid, this.emplogtype', self.dataOptions.eid, self.emplogtype,this.workOrders);
  //                   //self.workOrders = [];
  //                   //self.paceEnv.stopLoading();y
  //                  // self.paceEnv.startLoading();
  //                   //self.cloneGetWorkOrders();
  //                   // if(action=='D')
  //                   //   self.workOrders[woindex].WOSERVICES[serviceindex].empid = "--Select--";

  //                   // if (action == 'C') {
  //                   //   if(self.workOrders[woindex].WOSERVICES.length>1)
  //                   //   self.workOrders[woindex].WOSERVICES.splice(serviceindex, 1);
  //                   //   else
  //                   //   self.workOrders.splice(woindex, 1);
  //                   // }
  //                 }
  //               }, (err) => {
  //                 //self.paceEnv.stopLoading();
  //                 loader.dismiss();
  //                 console.log('err', err);
  //               })
  //             } else {
  //               loader.dismiss();
  //               //self.paceEnv.stopLoading();
  //             }
  //           }, (err) => {
  //             loader.dismiss();
  //             //this.paceEnv.stopLoading();
  //             console.log('err', err);
  //           })
  //         }
  //       }
  //     ]
  //   });
  //   alert.present();
  // }

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
                    console.log('index',woMainIndex,serviceindex,woindex, action)
                    if(subWorkorder  == true){
                      this.workOrders[woMainIndex].SUBWORKORDER[woindex].WOSERVICES[serviceindex]= Object.assign({},result[0].SERVICEITEM[0]);
                      this.selectedEmpId="0";
                      setTimeout(() => {
                        //this.cloneGetWorkOrders(woMainIndex,action)
                        if(action=="C"){
                        //this.workOrders = [];
                        this.getWorkOrders(woMainIndex); 
                        } 
                      }, 1000);                      
                      }else
                    {
                      //console.log('emp data empid, this.emplogtype', self.dataOptions.eid, self.emplogtype,this.workOrders,this.workOrders[woindex].WOSERVICES[serviceindex + 1]);
                      if (this.workOrders[woindex].WOSERVICES[serviceindex + 1] != undefined) {
                        if (this.workOrders[woindex].WOSERVICES[serviceindex + 1].SSIID == result[0].SERVICEITEM[0].SSIID) {
                          //console.log('hi');
                          this.workOrders[woindex].WOSERVICES[serviceindex + 1] = result[0].SERVICEITEM[0];
                          this.workOrders[woindex].filterPackeges[serviceindex] = result[0].SERVICEITEM[0];
                          setTimeout(() => {
                            //this.cloneGetWorkOrders(woindex,action)
                            if(action=="C"){
                            //this.workOrders = [];
                            this.getWorkOrders(woindex);
                            }  
                          }, 1000);
                             
                        }
                        else {
                          if (this.workOrders[woindex].WOSERVICES[serviceindex].SSIID == result[0].SERVICEITEM[0].SSIID) {
                            //console.log('hicode');
                            this.workOrders[woindex].filterPackeges[serviceindex] = result[0].SERVICEITEM[0]
                             this.workOrders[woindex].WOSERVICES[serviceindex] = result[0].SERVICEITEM[0]
                             setTimeout(() => {
                              //this.cloneGetWorkOrders(woindex,action)
                              if(action=="C"){
                              //this.workOrders = [];
                              this.getWorkOrders(woindex);  
                              }
                            }, 1000);
                            
                          }
                        }
                      } else {
                        this.workOrders[woindex].filterPackeges[serviceindex] = Object.assign({}, result[0].SERVICEITEM[0]);
                        this.workOrders[woindex].WOSERVICES[serviceindex] = result[0].SERVICEITEM[0]
                        setTimeout(() => {
                          //this.cloneGetWorkOrders(woindex,action)
                          if(action=="C"){
                          //this.workOrders = [];
                          this.getWorkOrders(woindex); 
                          } 
                        }, 1000);
                        
                      }
                      //this.workOrders[woindex].WOSERVICES[serviceindex] =Object.assign({},result[0].SERVICEITEM[0]);
                      //this.cloneGetWorkOrders(woindex);
                      //this.zone.run(() => { this.workOrders[woindex].filterPackeges[serviceindex] =Object.assign({},result[0].SERVICEITEM[0])});
                    }
                   
                     //this.employeeWorkOrderPermissionforactions("");
                    //  if(subWorkorder  == true){
                    //  this.workOrders[woindex].SUBWORKORDER[serviceindex].WOSERVICES[serviceindex]= Object.assign({},result[0].SERVICEITEM[0]);
                    //  }
                    // this.workOrders.forEach((index,el)=>{
                    //   if(index[el].filterPackeges[serviceindex].SSIID==result[0].SERVICEITEM[0].SSIID){
                    //      
                    //   }
                    // })
                    
                   
                  
                    console.log('emp data empid, this.emplogtype', self.dataOptions.eid, self.emplogtype,this.workOrders);
                    //self.workOrders = [];
                    //self.paceEnv.stopLoading();y
                   // self.paceEnv.startLoading();
                    //self.cloneGetWorkOrders();
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




  employeeWorkOrderPermissionforactions() {
    let self = this;
    //this.paceEnv.startLoading();
    this.OdsSvc.employeeWorkOrderPermissionforactions(this.dataOptions).subscribe(Response => {
      //this.paceEnv.stopLoading();
      if (Response[0].result !== '') {
        let result = JSON.parse(Response[0].result);
        self.getWorkOrders("L");
        self.workOrderPermission = Object.assign({}, result[0].WOPERMISSIONS[0]);
        console.log('Permissions',self.workOrderPermission);
        
       
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
    //console.log('woSindex', workOderIndex,packege);
    //let loader = this.loadingSrv.createLoader();
    //loader.present();
    
    this.workOrders[workOderIndex].selectedPackege = woSindex;
    this.workOrders[workOderIndex].filterPackeges = this.workOrders[workOderIndex].WOSERVICES.filter(data => {
      //loader.dismiss();
      return data.SSIID == packege.SSIID;
      
    });
  
  }
  getPackeges(workOrder: any) {
    let newArray = workOrder.WOSERVICES.reduce(
      (accumulator, current) => accumulator.some(x => x.PACKAGENAME === current.PACKAGENAME) ? accumulator : [...accumulator, current], []
    );
    return newArray;
  }
  // valueChange(selectedemp,spackage, i, serviceindex, subWorkorder = false, subWoindex = 0) {
  //   console.log('selectedemp', selectedemp, spackage, i, serviceindex);
  //   spackage.empid = selectedemp.empid;
  //   if (selectedemp.type == 'NEW')
  //     this.empSelection(spackage, i, serviceindex, subWorkorder, subWoindex);
  //   if (selectedemp.type == 'UPDATE')
  //     this.empSelectionUpdate(spackage, i, serviceindex, spackage.empid, subWorkorder, subWoindex);
  // }

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
    let loader = this.loadingSrv.createLoader();
    loader.present();
    this.OdsSvc.approveAdmin(paramObj).subscribe((approveData:any)=>{
      loader.dismiss();
      if(approveData[0].errorId > 0){
        setTimeout(() => {
          //this.paceEnv.startLoading();
          //this.workOrders = [];
          //this.getWorkOrders(); 
          this.cloneGetWorkOrders(i);
        }, 2000);
        //this.paceEnv.stopLoading();
      }   
    },err=>{
      loader.dismiss();
    })

  }

  onClick(rating,list,index){
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
      // setTimeout(() => {
      //   this.paceEnv.startLoading();
       //this.workOrders = [];
      //this.getWorkOrders();  
      // }, 2000);
       // this.paceEnv.stopLoading();
      this.cloneGetWorkOrders(index);

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
    let Modal = this.modalctrl.create(FeedBackComponent, {workOrderObj: woList,logged:this.loggedEmp,type:'feedBack'}, { cssClass: "full-height-modal" });
    Modal.present().then(val => {
      loader.dismiss();
    }).catch(err => {
      console.log(err);
      loader.dismiss();
    });;
  }
    
}
////clone get workOrders
cloneGetWorkOrders(woIndex){
  //console.log(woObj);
  
   
    
    
    this.paceEnv.startLoading();
    let searchOptions:string = `<Info><siteid>${this.dataOptions.siteid}</siteid><pageNumber>1</pageNumber><pageSize>5</pageSize><eid>${this.dataOptions.eid}</eid><searchtype>WO</searchtype><searchtext>${this.workOrders[woIndex].WONUMBER}</searchtext><searchstatus>${this.dataOptions.searchstatus}</searchstatus></Info>`.trim();
    //let searchOptions: string = `<Info><siteid>${this.dataOptions.siteid}</siteid><pageNumber>${this.dataOptions.pageNumber}</pageNumber><pageSize>${this.dataOptions.pageSize}</pageSize><eid>${this.dataOptions.eid}</eid><searchtype>${this.dataOptions.searchtype}</searchtype><searchtext>${this.workOrders[woIndex].WONUMBER}</searchtext><searchstatus>${this.dataOptions.searchstatus}</searchstatus></Info>`.trim();
    
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
          console.log(result,'vt');
          
          result.forEach((element, index) => {
            //console.log(action);
            
            // if(action == 'C'){
            //   element.ACTIVE =action
            // }
            
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
            this.cloneWorkOrders=[];
            //this.cloneWorkOrders.push(Object.assign({}, element));
            //this.workOrders[Woindex]
            this.workOrders[woIndex] = result[0];
            this.workOrders.forEach((selectOd, odIndex) => {
              this.changeDetectorRef.detectChanges();
              this.selectedPackege(odIndex, selectOd.UniquePackeges[0]);
              
            });
          });
          //this.selectedPackege(Woindex, woObj.UniquePackeges[0]);
          this.infinitescrollactions(true, false, false);
          this.woqEmpty();
        }
        // if(this.workOrders.length == 20){
        // this.workOrders = [...this.cloneWorkOrders]
        // }
        // else{
        //   this.workOrders.concat(this.cloneWorkOrders)
        // }
        console.log('workorder end', this.workOrders,'cloneObj',this.cloneWorkOrders);
       
      } else {
        this.woqEmpty();
      }
    }, (err) => {
      console.log('get order err', err);
      this.paceEnv.stopLoading();
      this.woqEmpty();
    });

}
///
  
  
}
