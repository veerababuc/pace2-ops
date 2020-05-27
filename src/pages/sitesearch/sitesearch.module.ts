import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SitesearchPage } from './sitesearch';

@NgModule({
  declarations: [
    SitesearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SitesearchPage),
  ],
})
export class SitesearchPageModule {}
