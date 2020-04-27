import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { PaceEnvironment } from '../common/PaceEnvironment';
import { DatabaseProvider } from '../providers/database/database';
import {SQLite} from '@ionic-native/sqlite';
import { HttpModule } from '@angular/http';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { NetworkInterface } from '@ionic-native/network-interface';
import { LoadingServiceProvider } from '../providers/loading-service/loading-service';
import { OdsServiceProvider } from '../providers/ods-service/ods-service';
//import { FeedBackComponent } from '../components/feed-back/feed-back';
import { AppVersion } from '@ionic-native/app-version';
import { FeadBackModule } from '../components/feed-back/feed-bacm.module';
import { NativeStorage } from '@ionic-native/native-storage';
//import { pace2createnewserviceModule } from '../../components/pace2createnewservice/pace2createnewservice.module';
//import { Pace2NotesModule } from '../components/pace2notes/pace2notes.module';
//import { Pace2deleteModule } from '../../components/pace2delete/pace2delete.module';

@NgModule({
  declarations: [
    MyApp,
   // FeedBackComponent
  ],
  imports: [
    BrowserModule,HttpModule,
    IonicModule.forRoot(MyApp),
    FeadBackModule,
   // pace2createnewserviceModule,
   // Pace2deleteModule,
  //  Pace2NotesModule
   
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
   // FeedBackComponent
  
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PaceEnvironment,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DatabaseProvider,SQLite,
    Device,
    LoadingServiceProvider,
    Network,NetworkInterface,
    // FCM,
    AppVersion,
    LoadingServiceProvider,
    OdsServiceProvider,
    NativeStorage
  ]
})
export class AppModule {}