import { NgModule } from '@angular/core';
import { WorkordereditComponent } from './workorderedit/workorderedit';
import { Pace2createnewserviceComponent } from './pace2createnewservice/pace2createnewservice';
import { Pace2selectdepartmentComponent } from './pace2selectdepartment/pace2selectdepartment';
import { FeadBackModule } from './feed-back/feed-bacm.module';

@NgModule({
	declarations: [WorkordereditComponent,
    Pace2createnewserviceComponent,
    Pace2selectdepartmentComponent,
    ],
	imports: [FeadBackModule,],
	exports: [WorkordereditComponent,
    Pace2createnewserviceComponent,
    Pace2selectdepartmentComponent,
    ],
    
})
export class ComponentsModule {}
