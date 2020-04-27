import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Pace2notesComponent } from './pace2notes';

@NgModule({
    declarations: [Pace2notesComponent],
    imports: [IonicPageModule.forChild(Pace2notesComponent)],
    exports: [Pace2notesComponent],
    providers: []
})
export class Pace2NotesModule { }