import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
})
export class TestPage {
  woid:any;
  type:any;
wodname:any;
wodid:any;
fcid:any;
Wodata:any;
Wosid:any;
Dname:any;
Did:any;
modalno:any;
Deptdata:any=[];
notes :any;
Packid:any;
NoteType:any;
SId:any;
loggedEmp:any;
Type:any;
wodataObj:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.type = this.navParams.get('type');
    this.woid = this.navParams.get('Data');
    this.wodname = this.navParams.get('WoDname');
    this.wodid = this.navParams.get('WoDid');
    this.fcid = this.navParams.get('FCID');
    this.Wodata= this.navParams.get('Wodata');
    this.NoteType = this.navParams.get('NType');
    this.SId = this.navParams.get('SId');
    this.Dname = this.navParams.get('DeptName');
    this.Did = this.navParams.get('DeptId');
    this.Deptdata = this.navParams.get('Dept');
    this.modalno = this.navParams.get('modalno');
    this.notes = this.navParams.get('NotesData');
    this.Packid = this.navParams.get('PackId');
    // this.wodataObj = this.navParams.get('workOrderObj');
    // this.Type = this.navParams.get('type');
    // this.loggedEmp = this.navParams.get('logged');
    console.log(' TestPage  empid.....', this.Type,this.woid,this.wodataObj,this.NoteType,this.SId );
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
  }

}