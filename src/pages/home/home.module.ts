import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HomePage } from './home';
import { pace2headerModule } from '../../components/pace2header/pace2headermodule';

@NgModule({
  declarations: [
    HomePage,
  ],
  imports: [
    IonicPageModule.forChild(HomePage),
    pace2headerModule
  ],
})
export class HomePageModule {}
