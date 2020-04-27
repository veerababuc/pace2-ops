import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkorderQueuePage } from './workorder-queue';
import { pace2headerModule } from '../../components/pace2header/pace2headermodule';
import { customselectModule } from '../../components/custom-select/custom-selectmodule';

@NgModule({
  declarations: [
    WorkorderQueuePage,  
  ],
  imports: [
    IonicPageModule.forChild(WorkorderQueuePage),
    pace2headerModule,
    customselectModule,
   
  ],
})
export class WorkorderQueuePageModule {}