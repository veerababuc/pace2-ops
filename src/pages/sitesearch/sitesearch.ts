import { Component } from '@angular/core';
import { IonicPage, ViewController, Platform, NavParams } from 'ionic-angular';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { NativeStorage } from '@ionic-native/native-storage';



@IonicPage({
  name:'page-sitesearch'
})
@Component({
  selector: 'page-sitesearch',
  templateUrl: 'sitesearch.html',
})
export class SitesearchPage {
  site:any=[];
  searchTerm:string="";
  resultsite:any=[];
  selectedItem:any=[];
  platform_tabclass:boolean=false;
  hide_buttons:string='N';
  constructor(public navParams: NavParams,
    public viewctrl:ViewController,
    public alert:PaceEnvironment,platform:Platform,
    private storage:NativeStorage) {
     if(platform.is('ios'))
     {
       this.platform_tabclass=true;
     }
     else
     {
       this.platform_tabclass=false;
     }

    this.site=this.navParams.get('Data');
    console.log("change sites",this.site)
    this.resultsite=this.site;
    this.resultsite.forEach(element => {
          if(element.status==true)
          {
            this.selectedItem=element;
          }
    });

  }

  setFilter()
  {
    this.resultsite=this.filterSites(this.searchTerm);
  }

  filterSites(searchTerm)
  {
    return this.site.filter((item)=>{
      return item.siteTitle.toLowerCase().indexOf(searchTerm.toLowerCase())>-1;
    })
  }
  CheckedSite(item)
  {
    this.selectedItem=[];
    this.selectedItem=item;
    this.hide_buttons='N';
    this.storage.setItem('userlist',[]).then();
 }
  closeModal()
  {
    this.viewctrl.dismiss({'sitesearchresult':''});
  }
  saveSite()
  {
    if(this.selectedItem.length==0)
    {
      this.alert.addErrorMessage("Select atleast one site");
      this.alert.displayErrors();
    }
    else
    {
      this.viewctrl.dismiss({'sitesearchresult':this.selectedItem})
    }
  }

  hideButtons(flag)
  {
     this.hide_buttons=flag;
  }

}
