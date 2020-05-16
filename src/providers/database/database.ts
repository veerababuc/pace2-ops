import { Http,Response } from '@angular/http';
import { Injectable } from '@angular/core';
import {SQLite,SQLiteObject} from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { BehaviorSubject } from 'rxjs';
/*
  Generated class for the DatabaseProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

@Injectable()
export class DatabaseProvider {
  public ipadress:any="";
  private db:SQLiteObject;
  private databaseReady: BehaviorSubject<boolean>;
  private isOpen:boolean;
  loc:string="";
  public ipAddress:any="";
  public fcmtoken:any="";
  constructor(public http: Http,public storage:SQLite,private platform: Platform) {
   
   this.loc=platform.is('ios')==true?"Library":"default";
   this.databaseReady=new BehaviorSubject(false);
   platform.ready().then(()=>{
    this.createDB(this.isOpen);
   })
   
}
  createDB(open:boolean)
  {
    
    if(!open)
    {
      this.storage=new SQLite();
      if(this.platform.is('android'))
      {
        this.storage.create({name:"paceUser.db",location:this.loc}).then((db:SQLiteObject)=>{
          this.db=db;
          db.executeSql("CREATE TABLE  IF NOT EXISTS tblpaceUser(id INTEGER PRIMARY KEY AUTOINCREMENT,EmpId TEXT, LoginId TEXT, Password TEXT,Empname TEXT,Rolename TEXT,RoleID TEXT,Token TEXT,SiteID TEXT,Rem TEXT,Emplogo TEXT,SiteLogo TEXT,SiteTitle TEXT,SiteCount TEXT,DeaprtmentId TEXT,SiteNumber TEXT,LogType TEXT,StockCount TEXT,PO TEXT,RO TEXT,Permission TEXT)",[]);
          this.isOpen=true;
          console.log("Database Created");
          this.databaseReady.next(true);
          }).catch((error)=>{console.log("Error while creation",error)});
      }
      else if(this.platform.is('ios'))
      {
        this.storage.create({name:"paceUser.db",iosDatabaseLocation:this.loc}).then((db:SQLiteObject)=>{
          this.db=db;
          db.executeSql("CREATE TABLE  IF NOT EXISTS tblpaceUser(id INTEGER PRIMARY KEY AUTOINCREMENT,EmpId TEXT, LoginId TEXT, Password TEXT,Empname TEXT,Rolename TEXT,RoleID TEXT,Token TEXT,SiteID TEXT,Rem TEXT,Emplogo TEXT,SiteLogo TEXT,SiteTitle TEXT,SiteCount TEXT,DeaprtmentId TEXT,SiteNumber TEXT,LogType TEXT,StockCount TEXT,PO TEXT,RO TEXT,Permission TEXT)",[]);
          this.isOpen=true;
          console.log("Database Created");
          this.databaseReady.next(true);
          }).catch((error)=>{console.log("Error while creation",error)});
      }

           

  }
}
public getDatabaseState()
{
  return this.databaseReady.asObservable();
}

  createUser(userId:string,name:string,loginid:string,password:string,roleid:string,rolename:string,token:any,rem:any,emplogo:string,empdepid:any,logtype:string)
  {
    return new Promise((resolve,reject)=>{
        this. deleteUser();
      let query="INSERT INTO tblpaceUser (EmpId,Empname,LoginId,Password,RoleID,Rolename,Token,Rem,SiteID,Emplogo,SiteLogo,SiteTitle,DeaprtmentId,SiteNumber,LogType,StockCount,PO,RO,Permission) VALUES (?,?,?,?,?,?,?,?,0,?,?,'',?,?,?,0,'','','')";
      this.db.executeSql(query,[userId,name,loginid,password,roleid,rolename,token,rem,emplogo,'',empdepid,0,logtype])
             .then((data)=>{
               resolve(data);
             },(error)=>{reject(error)}
            );
      });
  }
  
  getAllUsers()
  {
    return new Promise((resolve,reject)=>{
       let query="SELECT * FROM tblpaceUser";
       this.db.executeSql(query,[])
              .then((data)=>{
               let users=[];
               for(var i=0;i<data.rows.length;i++)
               {
                 users.push({
                  id:data.rows.item(i).id,
                  EmpId:data.rows.item(i).EmpId,
                  LoginId:data.rows.item(i).LoginId,
                  Password:data.rows.item(i).Password,
                  Empname:data.rows.item(i).Empname,
                  Rolename:data.rows.item(i).Rolename,
                  RoleID:data.rows.item(i).RoleID,
                  Token:data.rows.item(i).Token,
                  SiteID:data.rows.item(i).SiteID,
                  Rem:data.rows.item(i).Rem,
                  Emplogo:data.rows.item(i).Emplogo,
                  SiteLogo:data.rows.item(i).SiteLogo,
                  SiteTitle:data.rows.item(i).SiteTitle,
                  SiteCount:data.rows.item(i).SiteCount,
                  DeaprtmentId:data.rows.item(i).DeaprtmentId,
                  SiteNumber:data.rows.item(i).SiteNumber,
                  LogType:data.rows.item(i).LogType,
                  StockCount:data.rows.item(i).StockCount,
                  PO:data.rows.item(i).PO,
                  RO:data.rows.item(i).RO,
                  Permission:data.rows.item(i).Permission
                 });
               }
              resolve(users);

              },(error)=>{
                reject(error)
              });
    });
  }

  deleteUser()
  {
    return new Promise((resolve,rekject)=>{
         let query="DELETE FROM  tblpaceUser ";
           this.db.executeSql(query,[])
                  .then((data)=>{
                    this.db.executeSql("DELETE FROM SQLITE_SEQUENCE WHERE name='tblpaceUser'",[]).then((res)=>{
                    });
                    resolve(data)
                  },(error)=>{resolve(error)}
                )
    })
  }

  updateUser(eid,name,rolename,image)
  {
    return new Promise((resolve,reject)=>{

      let query="Update tblpaceUser SET Empname=?,Rolename=?,Emplogo=?,SiteCount=?  Where EmpId=?";
      this.db.executeSql(query,[name,rolename,image,eid])
      .then((data)=>{
        resolve(data)
      },(error)=>{reject(error)}
    );
    })
  }


  insertSiteInfo(empid,empsiteid,empsitetitle,empsitelogo,empsitenumber)
  {
     return new Promise((resolve,reject)=>{
      this.deleteSiteInfo();
       let query="INSERT INTO EmpSiteInfo(EmpId,EmpSiteId,EmpSiteTile,EmpSiteLogo) VALUES (?,?,?,?)"
       this.db.executeSql(query,[empid,empsiteid,empsitetitle,empsitelogo])
         .then((data)=>{
           resolve(data);
         },(error)=>reject(error));
     })
  }

 getSiteInfo()
  {
    return new Promise((resolve,reject)=>{
      let query="SELECT * FROM EmpSiteInfo";
       this.db.executeSql(query,[])
         .then((data)=>{
            let info=[];
            for(var i=0;i<data.rows.length;i++)
            {
              info.push({
                empid:data.rows.item(i).EmpId,
                siteId:data.rows.item(i).EmpSiteId,
                siteTitle:data.rows.item(i).EmpSiteTile,
                siteLogo:data.rows.item(i).EmpSiteLogo
              })
            }
            resolve(info);
         },(error)=>reject(error))
    })
  }



deleteSiteInfo()
  {
    return new Promise((resolve,rekject)=>{
         let query="DELETE FROM  EmpSiteInfo ";
           this.db.executeSql(query,[])
                  .then((data)=>{
                    this.db.executeSql("DELETE FROM SQLITE_SEQUENCE WHERE name='EmpSiteInfo'",[]).then((data)=>{
                                    })
                    resolve(data)
                  },(error)=>{resolve(error)}
                )
               
    })
  }



 UpdateSiteInfo_EMP(siteid,sitelogo,sitetitle,empid,sitecount,sitenumber,stockcount,po,ro,permission)
  {
    return new Promise((resolve,reject)=>{
let query="Update tblpaceUser SET SiteID=?,SiteLogo=?,SiteTitle=?,SiteCount=?,SiteNumber=?,StockCount=?,PO=?,RO=?,Permission=?  Where EmpId=?";
this.db.executeSql(query,[siteid,sitelogo,sitetitle,sitecount,sitenumber,stockcount,po,ro,permission,empid])
.then((data)=>{
              resolve(data)
            },(error)=>{reject(error)}
          );
          })
  }

  getIP(){
    return this.http.get('https://jsonip.com/')
    .map((res:Response)=>res.json())
   }
 
}
