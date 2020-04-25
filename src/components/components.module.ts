import { NgModule } from '@angular/core';
import { WorkordereditComponent } from './workorderedit/workorderedit';
import { Pace2createnewserviceComponent } from './pace2createnewservice/pace2createnewservice';
import { Pace2selectdepartmentComponent } from './pace2selectdepartment/pace2selectdepartment';
import { FeadBackModule } from './feed-back/feed-bacm.module';
import { workordereditModule } from './workorderedit/workordermodule';

@NgModule({
	declarations: [
    Pace2createnewserviceComponent,
    Pace2selectdepartmentComponent,
    ],
	imports: [FeadBackModule,workordereditModule],
	exports: [
    Pace2createnewserviceComponent,
    Pace2selectdepartmentComponent,
    ],
    
})
export class ComponentsModule {}
