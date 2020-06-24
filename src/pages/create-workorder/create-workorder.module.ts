import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CreateWorkorderPage } from './create-workorder';
import{BarcodeScanner} from '@ionic-native/barcode-scanner';
import {Camera} from '@ionic-native/camera';
import {DatePicker} from '@ionic-native/date-picker';
import {Device} from '@ionic-native/Device';
import { pace2headerModule } from '../../components/pace2header/pace2headermodule';



@NgModule({
  declarations: [    CreateWorkorderPage,
   
  ],
  imports: [
    IonicPageModule.forChild(CreateWorkorderPage),
    pace2headerModule
  ],
  
  providers:[
    BarcodeScanner,Camera,DatePicker ,Device
  ]
})
export class CreateWorkorderPageModule {}
