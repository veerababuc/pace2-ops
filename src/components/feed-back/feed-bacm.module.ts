import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FeedBackComponent } from './feed-back';

@NgModule({
  declarations: [
    FeedBackComponent,
  ],
  imports: [
    IonicPageModule.forChild(FeedBackComponent),
  ],
})
export class FeadBackModule {}
