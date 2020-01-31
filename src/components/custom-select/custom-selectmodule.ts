import { NgModule, Injectable } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { CustomSelectComponent } from './custom-select';

@NgModule({
    declarations: [CustomSelectComponent],
    imports: [IonicModule],
    exports: [CustomSelectComponent],
    providers: []
})
export class customselectModule { }