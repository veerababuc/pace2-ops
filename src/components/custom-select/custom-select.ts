import { Component, OnChanges, Input, SimpleChanges, Output, EventEmitter, ElementRef, NgZone } from '@angular/core';
//import { NG_VALUE_ACCESSOR , ControlValueAccessor } from '@angular/forms';
/**
 * Generated class for the CustomSelectComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'custom-select',
  templateUrl: 'custom-select.html',
  host: {
    '(document:click)': 'onClick($event)',
  },
  // providers: [
  //   { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CustomSelectComponent), multi: true }
  // ]
})
export class CustomSelectComponent implements OnChanges {
  @Input('optionsModel') optionsModel: any[];
  localValue: string = '';
  @Input() text: string = '';
  @Input() color: string = '#fff';
  @Input() value: any = '';
  @Input() optValue :string='value';
  @Input() optName :string='name';
  @Input() optColor: string = 'color';
  @Input() optLblTxt: string = 'N';
  @Input() optSelectActive?:boolean = false;
  @Input('defaultOptTxt') dOptTxt: any = 'Select';
  @Output() valueChange: EventEmitter<string>;
  @Output() change: EventEmitter<Function>;
  dropDownActive:boolean = false;
  // @Input() 
  // get value(){
  // return this.localValue;
  // };

  // @Output() valueChange : EventEmitter<string>;



  propagateChange: any = () => { };
  constructor(private _eref: ElementRef,private zone: NgZone) {
    // console.log('Hello CustomSelectComponent Component');
    this.valueChange = new EventEmitter<string>();
    this.change = new EventEmitter<Function>();
  }

  ngOnChanges(changes : SimpleChanges){
    //this.propagateChange(this.model.value);
    //console.log(changes['optionsModel']);
    if(changes['value'] || changes['optionsModel'] ){
      if(changes['optSelectActive'] != undefined){
      if(changes['optSelectActive'].firstChange == true){
      this.optSelectActive = true;
      }else{
        this.optSelectActive = false;
      }
    }
      this.text = this.dOptTxt;
      if(this.optionsModel !=null && this.optionsModel instanceof Array)
      this.optionsModel.some(item =>{
        if(item[this.optValue].toString() == this.value.toString()){
          if(this.optLblTxt=='Y')
          {
             this.text = item[this.optName];
             this.text=this.text+' '+'($'+item['Price']+')';
          }
          else
          this.text = item[this.optName];

        this.color=item[this. optColor];
        
        return true;
        }

      })
    }
  }
  
  writeValue(value) {
    if (value) {
      // console.log('custom select model'+value);
      this.localValue = value;
    }
  }

  registerOnChange(fn) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}


  
  openDropDown($event:Event){
  this.dropDownActive = ! this.dropDownActive;
    if(this.dropDownActive)
    {
      setTimeout(()=>{
      let el=document.getElementById("Cust"+this.value+"");
      el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
      });
    }
  }

  selcVal(val:any){
    this.localValue=val+'';
    this.valueChange.emit(this.localValue);
    this.value = this.localValue;
    this.change.emit(this.value);
    //console.log(this.localValue);

  }

  
  onClick(event) {
    
    if ((!this._eref.nativeElement.contains(event.target)) && this.dropDownActive) { // or some similar check
      this.zone.run(() => { this.dropDownActive = false });
      
      
    }
  }

}