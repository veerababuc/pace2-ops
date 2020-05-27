import { Component,Input,EventEmitter, Output } from '@angular/core';
import { OdsServiceProvider } from '../../providers/ods-service/ods-service';
import { ViewController,ModalController } from 'ionic-angular';
/**
 * Generated class for the Pace2selectdepartmentComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'pace2selectdepartment',
  templateUrl: 'pace2selectdepartment.html'
})
export class Pace2selectdepartmentComponent {

  @Input() Departments:any;
  @Input() modalno:any;
  @Input() PackId:any;
  service:any;
  constructor(public ViewCtrl: ViewController,public OdsService: OdsServiceProvider) {
   
  }
  ngOnInit(){
    console.log('packid...',this.PackId);
    this.Departments.forEach(element => {
      element.ischecked = false;
      if(element.departmentNumber == this.PackId && this.modalno == 'two'){
        element.ischecked = true;
      }
    });
    console.log('in pace2selecteddept...', this.Departments);
  }
  Cancel(){
    this.ViewCtrl.dismiss();
  }
  OpenService(item){
    this.Departments.forEach(element => {
      if(this.modalno == 'one'){
     if(element.SDID == item.SDID){
       this.service = item;
       console.log('service item....', this.service);
      if(element.ischecked == false) {
        element.ischecked = true;
        item.ischecked = true;
      }else{
        element.ischecked = false;
        item.ischecked = false;
      }
     }else{
      element.ischecked = false;
     } 
    }else{
      if(element.departmentNumber == item.departmentNumber){
        this.service = item;
       console.log('service item....', this.service);
      if(element.ischecked == false) {
        element.ischecked = true;
        item.ischecked = true;
      }else{
        element.ischecked = false;
        item.ischecked = false;
      }
     }else{
      element.ischecked = false;
     } 
      
    }
    });
   
  }
  Ok(){
   console.log('in ok....', this.service);
    this.ViewCtrl.dismiss(this.service);
  } 
    
  
}
