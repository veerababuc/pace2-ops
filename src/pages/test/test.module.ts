import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestPage } from './test';
//import {Pace2exceptionComponent} from '../../components/pace2exception/pace2exception';
//import {Pace2addserviceComponent} from '../../components/pace2addservice/pace2addservice';
//import {Pace2notesComponent} from '../../components/pace2notes/pace2notes';
//import {Pace2deleteComponent} from '../../components/pace2delete/pace2delete';
//import {Pace2createnewserviceComponent} from '../../components/pace2createnewservice/pace2createnewservice';
//import {Pace2selectdepartmentComponent} from '../../components/pace2selectdepartment/pace2selectdepartment';
import { Pace2NotesModule } from '../../components/pace2notes/pace2notes.module';
import { Pace2exceptionModule } from '../../components/pace2exception/pace2exception.module';
//import { customselectModule } from '../../components/custom-select/custom-selectmodule';
//import { pace2createnewserviceModule } from '../../components/pace2createnewservice/pace2createnewservice.module';
//import { Pace2deleteModule } from '../../components/pace2delete/pace2delete.module';

@NgModule({
  declarations: [
    TestPage,
    //Pace2exceptionComponent,
    //Pace2addserviceComponent,
   // Pace2deleteComponent,
    //Pace2selectdepartmentComponent,
   // Pace2notesComponent
  ],
  imports: [
    IonicPageModule.forChild(TestPage),
    //customselectModule,
    //pace2createnewserviceModule,
   Pace2NotesModule,
  // Pace2deleteModule,
  Pace2exceptionModule
  ],
})
export class TestPageModule {}
