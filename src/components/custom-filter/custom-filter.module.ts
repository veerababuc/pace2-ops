import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CustomFilterPage } from './custom-filter';
import { customselectModule } from '../../components/custom-select/custom-selectmodule';

@NgModule({
  declarations: [
    CustomFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(CustomFilterPage),
    customselectModule,
  ],
})
export class CustomFilterPageModule {}
