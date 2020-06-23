import { Injectable } from '@angular/core';
import { Http, RequestOptions, Response, Headers } from '@angular/http';
import 'rxjs/Rx';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import moment from 'moment';

@Injectable()
export class OdsServiceProvider {
  private canGoBack = true;
  http: any;
  
  constructor(http: Http, public appconst: PaceEnvironment) {
    this.http = http;
  }

  // GetEmployeeInfo(employeeid: any) {
  //   let options = new RequestOptions({ headers: this.appconst.headers })
  //   return this.http.get(this.appconst.ApiUrl + "EmployeeInfo/" + employeeid)
  //     .map((res: Response) => res.json())
  // }
  public setValue(value: boolean) {
    this.canGoBack = value;
  }

  public getValue(): boolean {
    return this.canGoBack;
  }

  GetEmployeeInfo(employeeid: any) {
    let options = new RequestOptions({ headers: this.appconst.headers })
    return this.http.get(this.appconst.ApiUrl + "CMSEmployeeInformation/" + employeeid)
      .map((res: Response) => res.json())
  }



  // UpdateWorkOrder(obj: any) {
  //   let options = new RequestOptions({ headers: this.appconst.headers });
  //   let body = obj;
  //   console.log(this.appconst.ApiUrl + "UpdateWorkOrderInfo", body, options)
  //   return this.http.post(this.appconst.ApiUrl + "UpdateWorkOrderInfo", body, options)
  //     .map((res: Response) => res);
  // }

  // GetEmployeeInformation(employeeid: any) {
  //   return this.http.get(this.appconst.ApiUrl + "EmployeeInformation/" + employeeid)
  //     .map((res: Response) => res.json())
  // }

  GetEmployeeInformation(employeeid: any) {
    let body = { "strSearchString": "<Employees><ID>" + employeeid + "</ID></Employees>" };
    return this.http.post(this.appconst.ApiUrl + "CMSEmployeeInfo", body)
      .map((res: Response) => res.json())
  }


 
  // GetEmployeeSiteInfo(empid, logType) {
  //   let options = new RequestOptions({ headers: this.appconst.headers })
  //   if (logType == "C")
  //     return this.http.get(this.appconst.ApiUrl + "SitesInformationXML/", options)
  //       .map((res: Response) => res)
  //   else
  //     return this.http.get(this.appconst.ApiUrl + "EmployeeSitesInformationXML/" + empid, options)
  //       .map((res: Response) => res)
  // }


  GetEmployeeSiteInfo(empid, logType) {
    const header=this.setHeader();
    let options = new RequestOptions({ headers: header });    
    let body=`{"strSearchString":"<Info><type>`+logType+`</type><eid>`+empid+`</eid></Info>"}`;
    return this.http.post(this.appconst.ApiUrl + "GetDashboardSites/" ,body,options)
    .map((res: Response) => res.json());
    
    }

    private setHeader(): Headers {
      const headersConfig = new Headers();
      headersConfig.append('Content-type', 'application/json');
      headersConfig.append('Accept', 'application/json, text/plain, */*');
      headersConfig.append('Pragma','no-cache');
      headersConfig.append('Cache-Control','no-cache');
      return headersConfig;
    }

  GetStockPORODetails(siteid) {
    let options = new RequestOptions({ headers: this.appconst.headers })

    return this.http.get(this.appconst.ApiUrl + "SiteInfoforCreateWO/" + siteid, options)
      .map((res: Response) => res.json())
  }


  EmployeeTraditionalCheckIn(userid, pcode, deviceid) {
    const header = new Headers;
    header.append('strUserId', userid);
    header.append('strPasscode', pcode);
    let body = { 'strSearchString': '<deviceInfo> <deviceType>m</deviceType> <loginType>2</loginType> <deviceId>' + deviceid + '</deviceId> <ipAddress>' + this.appconst.ipAddress + '</ipAddress> </deviceInfo>' };
    const options = new RequestOptions({ headers: header });
    return this.http.post(this.appconst.ApiUrl + "UserLogin", body, options)
      .map((res: Response) => res.json())
  }


  //  EmployeeTraditionalCheckIn(userid,pcode){
  //   let options=new RequestOptions({headers:this.appconst.headers})
  //   return this.http.get(this.appconst.ApiUrl+"EmployeeTraditionalLogin/"+userid+"/"+pcode+"/mob/GN/0/login.aspx/10.10.10.10")
  //   .map((res:Response)=>res.json())
  //  }

  GetWorkOrderStatus(SrchStr) {
    let body = { "strSearchString": SrchStr };
    let options = new RequestOptions({ headers: this.appconst.headers });
    return this.http.post(this.appconst.ApiUrl + 'WoQueue/', body, options)
      .map((res: Response) => res);
  }

  // GetRequestedByUsers(siteid, role, target) {
  //   let options = new RequestOptions({ headers: this.appconst.headers });
  //   // return this.http.get(this.appconst.ApiUrl+"/RequestedByEmployees/"+siteid+"/SA/"+target,options)
  //   // .map((res:Response)=>res)
  //   return this.http.get(this.appconst.ApiUrl + "/SalesPersonInfo/" + siteid, options)
  //     .map((res: Response) => res);
  // }

  GetRequestedByUsers(siteid, role, target) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "strSearchString": "<info><role>SP</role><siteid>" + siteid + "</siteid></info>"
    }
    return this.http.post(this.appconst.ApiUrl + "/RetriveEmployeebySiteRole/", body, options)
      .map((res: Response) => res);
  }
  
  CreateWorkOrder(woxml,notesxml,partsxml,servicexml) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "woinfo": woxml,
      "wonotes":notesxml,
      "woparts":partsxml,
      "woservices":servicexml
    }

    console.log(JSON.stringify(body));
  return this.http.post(this.appconst.ApiUrl+"CreateWorkOrderV2",body,options)
   .map((res:Response)=>res.json());
}

  CheckWOExceptions(woxml, servicexml) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "WOInfo": woxml,
      "WOService": servicexml

    }
    return this.http.post(this.appconst.ApiUrl + "CheckWOExceptions", body, options)
      .map((res: Response) => res.json());
  }
  GetWOPermissionDetails(empid, siteid) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "strSearchString": `<Info><empid>${empid}</empid><siteid>${siteid}</siteid></Info>`
    }
    return this.http.post(this.appconst.ApiUrl + "GetWOPermissionDetails", body, options)
      .map((res: Response) => res.json());
  }


  GetSiteServicesInfo(siteid, empid) {
    let str = "<Info><s_id>" + siteid + "</s_id>";
    str += "<packagename></packagename>";
    str += "<sdid>0</sdid>";
    str += "<status>A</status>";
    str += "<pagenumber>1</pagenumber>";
    str += "<pagesize>25</pagesize></Info>"
    let body = {
      "strSearchString": str
    }
    let options = new RequestOptions({ headers: this.appconst.headers });
    return this.http.post(this.appconst.ApiUrl + "GetPackages", body, options)
      .map((res: Response) => res)
  }

  SearchInfo(srchxml) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = { "WoSearchString": srchxml };
    return this.http.post(this.appconst.ApiUrl + "/WOSearchInfobyServiceItem", body, options)
      .map((res: Response) => res);
  }
  vehicleSearch(srchxml) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = { "strSearchString": srchxml };
    return this.http.post(this.appconst.ApiUrl + "/RetriveWoVINSearch", body, options)
      .map((res: Response) => res);
  }

  SubmitSupportReq(EmpId, EName, Email, Phone, Desc) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "strEmpId": EmpId,
      "strEName": EName,
      "strEmail": Email,
      "strPhone": Phone,
      "strDesc": Desc
    }
    return this.http.post(this.appconst.ApiUrl + "/CUDSupportInfo", body, options)
      .map((res: Response) => res);
  }

  // CreateWorkOrder(obj: any) {
  //   let options = new RequestOptions({ headers: this.appconst.headers });
  //   let body = obj;
  //   return this.http.post(this.appconst.ApiUrl + "/AddWorkOrderInfoV3", body, options)
  //     .map((res: Response) => res);
  // }

  SendFCMToken(empid: any, fcmtoken: any, ip: any) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "EmpId": empid,
      "DeviceToken": fcmtoken,
      "DeviceType": "M",
      "Devicelog": "",
      "IpAddress": ip,
      "AppPckgVersion": "com.pllc.pace2ods"
    }
    return this.http.post(this.appconst.ApiUrl + "/EmployeeDevicePackageLogInfo", options)
      .map((res: Response) => res);
  }
  updateWorkOrderVechileInfo(updatexml) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = { "strSearchString": updatexml };
    return this.http.post(this.appconst.ApiUrl + "UpdateWorkOrderVechileInfo", body, options)
      .map((res: Response) => res);
  }
  voidWorkOrders(updatexml) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = { "strSearchString": updatexml };
    return this.http.post(this.appconst.ApiUrl + "VoidWorkOrders", body, options)
      .map((res: Response) => res);
  }
  addPartstoWO(woinfo, woparts) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "woinfo": woinfo,
      "woparts": woparts
    };
    return this.http.post(this.appconst.ApiUrl + "AddPartstoWO/", body, options)
      .map((res: Response) => res);
  }
  // AddPartstoWO/
  GetWoExceptionwithEmployeeFix(woid, empid) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "strSearchString": `<Info><woid>${woid}</woid><eid>${empid}</eid></Info>`
    }
    return this.http.post(this.appconst.ApiUrl + "WoExceptionwithEmployeeFix/", body, options)
      .map((res: Response) => res.json());
  }

  GetPackages(packageOpt) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "strSearchString": `<Info><s_id>${packageOpt.SiteId}</s_id><e_id>${packageOpt.loggedInEmpId}</e_id><logtype>${packageOpt.EmplogTypeCode}</logtype></Info>`.trim()
    }

    return this.http.post(this.appconst.ApiUrl + "GetPackagesforWorkOrder", body, options)
      .map((res: Response) => res.json());
  }

  GetFixDeliveryWoExceptions(woinfo, woservices, wofixnotes) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "woinfo": woinfo,
      "woservices": woservices,
      "wofixnotes": wofixnotes
    }
    return this.http.post(this.appconst.ApiUrl + "FixDeliveryWoExceptions/", body, options)
      .map((res: Response) => res.json());
  }

  CreateWorkOrderNotes(body) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    // let body={
    //   "strSearchString": `<Info><eid>3154</eid><logtype>D</logtype><serviceid>0</serviceid><date>10/15/2019</date><time>07:47 PM</time><ip>106.51.54.208</ip><type>W</type><action>A</action><wonid>0</wonid><woid>82</woid><notes>${notes}</notes></Info>`
    // }
    return this.http.post(this.appconst.ApiUrl + "CreateWorkOrderNotes/", body, options)
      .map((res: Response) => res.json());
  }

  GetRetriveWorkOrderNotes(woid, wosid,type) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "strSearchString": `<Info><woid>${woid}</woid><wosid>${wosid}</wosid><type>${type}</type></Info>`
    }
    return this.http.post(this.appconst.ApiUrl + "RetriveWorkOrderNotes/", body, options)
      .map((res: Response) => res.json());
  }

  getAssignmentEmployeeList(sid) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      strSearchString: `<Info><siteid>${sid.siteid}</siteid><eid>${sid.eid}</eid></Info>`
    }
    return this.http.post(this.appconst.ApiUrl + "AssignmentEmployeeList/", body, options)
      .map((res: Response) => res.json());
  }

  assignWOItem(servive) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      strSearchString: `<Info><eid>${servive.eid}</eid><eidlogtype>${servive.eidlogtype}</eidlogtype><assigneid>${servive.assigneid}</assigneid><assignelogtype>1</assignelogtype><serviceid>${servive.serid}</serviceid><date>${moment(new Date()).format('MM/DD/YYYY')}</date><time>${moment(new Date()).format('HH:mm A')}</time><ip>${servive.ip}</ip><isscanned>${servive.isscanned}</isscanned><action>${servive.action}</action></Info>`.trim()
    }
    return this.http.post(this.appconst.ApiUrl + "AssignWOItem/", body, options)
      .map((res: Response) => res.json());
  }

  pickUpService(servive) {
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      strSearchString: `<Info><action>${servive.action}</action><eid>${servive.empid}</eid><eidlogtype>${servive.eidlogtype}</eidlogtype><serviceid>${servive.serid}</serviceid><date>${moment(new Date()).format('MM/DD/YYYY')}</date><time>${moment(new Date()).format('HH:mm A')}</time><ip>${servive.ip}</ip><isscanned>${servive.isscanned}</isscanned><appversion>${this.appconst.appVersion}</appversion><deviceinfo>${this.appconst.deviceInfo}</deviceinfo></Info>`.trim()
    }
    console.log("Search String :", body);
    return this.http.post(this.appconst.ApiUrl + "WorkOrderPickUp/", body, options)
      .map((res: Response) => res.json());
  }

  refreshServiceItems(wosid){
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      strSearchString: `<Info><wosid>${wosid}</wosid></Info>`
    }
    return this.http.post(this.appconst.ApiUrl + "RefreshServiceItem/", body, options)
      .map((res: Response) => res.json());
  }

  employeeWorkOrderPermissionforactions(emp){
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      strSearchString: `<Info><eid>${emp.eid}</eid><siteid>${emp.siteid}</siteid></Info>`
    }
    return this.http.post(this.appconst.ApiUrl + "EmployeeWorkOrderPermissionforactions/", body, options)
    .map((res: Response) => res.json());
  }
  DeleteworkOrderException(woinfo,wonotes,woparts,woservices){
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "woinfo": woinfo,
      "wonotes": wonotes,
      "woparts": woparts,
      "woservices":woservices
    }
    return this.http.post(this.appconst.ApiUrl + "FixVoidWorkOrders/", body, options)
      .map((res: Response) => res.json());
  }
  GetallDepartments(){
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "strSearchString": `<Departments></Departments>`
    }
    return this.http.post(this.appconst.ApiUrl + "DepartmentInformation/", body, options)
      .map((res: Response) => res.json());
  }
  FixExceptions(woinfo,wonotes){
    let options = new RequestOptions({ headers: this.appconst.headers });
    let body = {
      "woinfo": woinfo,
      "wonotes": wonotes,
      
    }
    return this.http.post(this.appconst.ApiUrl + "FixWoExceptions/", body, options)
      .map((res: Response) => res.json());
  }


  GetrelatedPackages(srchxml)
  {
    let options=new RequestOptions({headers:this.appconst.headers});
    let body={"strSearchString":srchxml};
    return this.http.post(this.appconst.ApiUrl+"/getpackagesv2",body,options)
    .map((res:Response)=>res);
  }

  GetNewDepartments(srchxml)
  {
    let options=new RequestOptions({headers:this.appconst.headers});
    let body={"strSearchString":srchxml};
    return this.http.post(this.appconst.ApiUrl+"/ServiceDepartments",body,options)
    .map((res:Response)=>res);
  }
  approveAdmin(woData){
    let options=new RequestOptions({headers:this.appconst.headers});
    let body={"strWoId":woData.strWoId,"strApprovedBy":woData.strApprovedBy,"strApprovedDt":woData.strApprovedDt,"strApprovedTime":woData.strApprovedTime,"strIPAddress":woData.strIPAddress};
    return this.http.post(this.appconst.ApiUrl+"/WOApprovalRequest",body,options)
    .map((res: Response) => res.json());
    
  }
  fiveStarRating(srchxml)
  {
    let options=new RequestOptions({headers:this.appconst.headers});
    let body={"strSearchString":srchxml};
    return this.http.post(this.appconst.ApiUrl+"/WORatingUpdate",body,options)
    .map((res:Response)=>res);
  }
  getFeedBackInfo(srchxml)
  {
    let options=new RequestOptions({headers:this.appconst.headers});
    let body={"strSearchString":srchxml};
    return this.http.post(this.appconst.ApiUrl+"/WOFeedBackGet",body,options)
    .map((res:Response)=>res);
  }

  saveFeedBackInfo(srchxml)
  {
    let options=new RequestOptions({headers:this.appconst.headers});
    let body={"strSearchString":srchxml};
    return this.http.post(this.appconst.ApiUrl+"/WOFeedBackCUD",body,options)
    .map((res:Response)=>res);
  }

}
