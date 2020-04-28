import { NgModule } from '@angular/core';
import { WorkordereditComponent } from './workorderedit/workorderedit';
import { Pace2createnewserviceComponent } from './pace2createnewservice/pace2createnewservice';
import { Pace2selectdepartmentComponent } from './pace2selectdepartment/pace2selectdepartment';
import { FeedBackModule } from './feed-back/feed-back.module';

@NgModule({
	declarations: [WorkordereditComponent,
    Pace2createnewserviceComponent,
    Pace2selectdepartmentComponent,
    ],
	imports: [FeedBackModule,],
	exports: [WorkordereditComponent,
    Pace2createnewserviceComponent,
    Pace2selectdepartmentComponent,
    ],
    
})
export class ComponentsModule {}
