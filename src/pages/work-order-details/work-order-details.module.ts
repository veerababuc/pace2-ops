import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WorkOrderDetailsPage } from './work-order-details';
import { pace2headerModule } from '../../components/pace2header/pace2headermodule';
import { customselectModule } from '../../components/custom-select/custom-selectmodule';
@NgModule({
  declarations: [
    WorkOrderDetailsPage,
  ],
  imports: [
    IonicPageModule.forChild(WorkOrderDetailsPage),
    pace2headerModule,
    customselectModule
  ],
})
export class WorkOrderDetailsPageModule {}
