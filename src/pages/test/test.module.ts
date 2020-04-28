import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TestPage } from './test';
import {Pace2exceptionComponent} from '../../components/pace2exception/pace2exception';
import {Pace2addserviceComponent} from '../../components/pace2addservice/pace2addservice';
import {Pace2notesComponent} from '../../components/pace2notes/pace2notes';
import {Pace2deleteComponent} from '../../components/pace2delete/pace2delete';
import {Pace2createnewserviceComponent} from '../../components/pace2createnewservice/pace2createnewservice';
import {Pace2selectdepartmentComponent} from '../../components/pace2selectdepartment/pace2selectdepartment';
import { customselectModule } from '../../components/custom-select/custom-selectmodule';

@NgModule({
  declarations: [
    TestPage,
    Pace2exceptionComponent,
    Pace2addserviceComponent,
    Pace2notesComponent,
    Pace2deleteComponent,
    Pace2createnewserviceComponent,
    Pace2selectdepartmentComponent,
    
  ],
  imports: [
    IonicPageModule.forChild(TestPage),
    customselectModule
  ],
})
export class TestPageModule {}
