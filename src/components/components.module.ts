import { NgModule } from '@angular/core';
import { Pace2selectdepartmentComponent } from './pace2selectdepartment/pace2selectdepartment';
import { FeadBackModule } from './feed-back/feed-bacm.module';
import { workordereditModule } from './workorderedit/workordermodule';
import { pace2createnewserviceModule } from './pace2createnewservice/pace2createnewservice.module';

@NgModule({
	declarations: [
    Pace2selectdepartmentComponent,
    ],
    imports: [FeadBackModule,workordereditModule,
        pace2createnewserviceModule],
	exports: [
    Pace2selectdepartmentComponent,
    ],
    
})
export class ComponentsModule {}
