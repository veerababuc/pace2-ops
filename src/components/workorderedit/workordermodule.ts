import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { WorkordereditComponent } from './workorderedit';
import {BarcodeScanner} from '@ionic-native/barcode-scanner';
@NgModule({
    declarations: [WorkordereditComponent],
    imports: [IonicModule],
    exports: [WorkordereditComponent],
    providers:[BarcodeScanner]
})
export class workordereditModule { }