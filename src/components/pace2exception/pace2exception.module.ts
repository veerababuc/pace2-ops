import { NgModule } from '@angular/core';
import {  IonicModule } from 'ionic-angular';
import { Pace2exceptionComponent } from './pace2exception';
import { Pace2addserviceModule } from '../pace2addservice/pace2addservice.module';

@NgModule({
    declarations: [Pace2exceptionComponent],
    imports: [IonicModule,Pace2addserviceModule],
    exports: [Pace2exceptionComponent],
    providers: []
})
export class Pace2exceptionModule { }