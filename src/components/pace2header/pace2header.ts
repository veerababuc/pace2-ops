import { Component, Input } from '@angular/core';
import { DatabaseProvider } from '../../providers/database/database';
import { PaceEnvironment } from '../../common/PaceEnvironment';
import { Camera } from '@ionic-native/camera';
import { ActionSheetController } from 'ionic-angular';
import {  NavController } from 'ionic-angular';
@Component({
  selector: 'pace2header',
  templateUrl: 'pace2header.html'
})
export class Pace2headerComponent {
  emplogo: any;
  empname: any;
  emprole: any;
  imageData: any;
  photoTaken: boolean = false;
  photoSelected: boolean;
  @Input() siteNameInHeader: boolean = false;
  @Input() headerName:any='';
 
  base64string:string="";

  constructor(public navCtrl: NavController,private appconst:PaceEnvironment, private db:DatabaseProvider,public camera:Camera,public actionSheetController: ActionSheetController){
  
   this.setheader();
  
  }

  setheader() {
    this.db.getAllUsers().then(data => {
      let empimg: any = this.appconst.Paceimg + "profile/profile.png";
      if (data[0].Emplogo != "" && data[0].Emplogo != null) { empimg = this.appconst.Paceimg + "profile/" + data[0].Emplogo; }
      this.emplogo = empimg;
      this.empname = data[0].Empname;
      if (this.empname.length > 13) {
        this.empname = this.empname.substring(0, 12) + '..';
      }
      
      this.emprole = data[0].Rolename;
    });
  }
  /**********************************************Camera Methods*************************************************************************** */
  takepicture() {
    this.camera.getPicture({
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 800,
      targetHeight: 800,
      saveToPhotoAlbum: false
    }).then(imageData => {
      this.base64string = 'data:image/jpeg;base64,' + imageData;
      this.emplogo = this.base64string;
      this.imageData = imageData;
      this.photoTaken = true;
      this.photoSelected = false;
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }

  selectFromGallery() {
    this.camera.getPicture({
      quality: 75,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 800,
      targetHeight: 800,
      saveToPhotoAlbum: false,
      correctOrientation: true,

    }).then(imageData => {
      this.base64string = 'data:image/jpeg;base64,' + imageData;
      this.emplogo = this.base64string;
      this.imageData = imageData;
      this.photoTaken = false;
      this.photoSelected = true;
    }, error => {
      console.log("ERROR -> " + JSON.stringify(error));
    });
  }
  /********************************************************************************************************************************************** */

  ShowCameraPopup() {
    const actionsheet = this.actionSheetController.create({
      buttons: [
        {
          text: 'Take Photo',
          handler: () => this.takepicture(),
          cssClass: 'buttoncss',
          icon: 'camera'
        },
        {
          text: 'Choose From Gallery',
          handler: () => this.selectFromGallery(),
          cssClass: 'buttoncss',
          icon: 'images'
        },
        { text: 'Cancel', role: 'cancel', cssClass: 'buttoncss' }
      ],
      cssClass: "action-sheets-groups-page"

    });
    actionsheet.present();
  }

 
GotoHome(){
  this.navCtrl.push('home-page');
}
}
