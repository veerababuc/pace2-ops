import { NgModule } from '@angular/core';
import { WorkordereditComponent } from './workorderedit/workorderedit';
import { Pace2createnewserviceComponent } from './pace2createnewservice/pace2createnewservice';
import { Pace2selectdepartmentComponent } from './pace2selectdepartment/pace2selectdepartment';
import { FeedBackComponent } from './feed-back/feed-back';

@NgModule({
	declarations: [WorkordereditComponent,
    Pace2createnewserviceComponent,
    Pace2selectdepartmentComponent,
    FeedBackComponent],
	imports: [],
	exports: [WorkordereditComponent,
    Pace2createnewserviceComponent,
    Pace2selectdepartmentComponent,
    FeedBackComponent],
    
})
export class ComponentsModule {}
