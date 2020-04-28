import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ExceptionFixPage } from './exception-fix';
import { Pace2addserviceModule } from '../../components/pace2addservice/pace2addservice.module';

@NgModule({
  declarations: [
    ExceptionFixPage,
  ],
  imports: [
    IonicPageModule.forChild(ExceptionFixPage),
    Pace2addserviceModule
  ],
})
export class ExceptionFixPageModule {}
