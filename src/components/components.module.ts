import { NgModule } from '@angular/core';
//import { Pace2selectdepartmentComponent } from './pace2selectdepartment/pace2selectdepartment';
import { FeadBackModule } from './feed-back/feed-bacm.module';
import { workordereditModule } from './workorderedit/workordermodule';
import { pace2createnewserviceModule } from './pace2createnewservice/pace2createnewservice.module';
import { Pace2NotesModule } from './pace2notes/pace2notes.module';
import { Pace2deleteModule } from './pace2delete/pace2delete.module';

@NgModule({
	declarations: [
   // Pace2selectdepartmentComponent,
    ],
    imports: [FeadBackModule,workordereditModule,
        pace2createnewserviceModule,Pace2NotesModule,Pace2deleteModule],
	exports: [
   // Pace2selectdepartmentComponent,
    ],
    
})
export class ComponentsModule {}
