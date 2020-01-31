import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalpagePage } from './modalpage';
import { workordereditModule } from '../../components/workorderedit/workordermodule';
@NgModule({
  declarations: [
    ModalpagePage,
  ],
  imports: [
    IonicPageModule.forChild(ModalpagePage),
    workordereditModule
  ],
})
export class ModalpagePageModule {}
