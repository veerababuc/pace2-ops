import { NgModule, Injectable } from '@angular/core';
import { Pace2headerComponent } from './pace2header';
import { IonicModule } from 'ionic-angular';
import { Camera } from '@ionic-native/camera';

@NgModule({
	declarations: [Pace2headerComponent],
	imports: [IonicModule],
	exports: [Pace2headerComponent],
	providers:[Camera]
})
export class pace2headerModule {}