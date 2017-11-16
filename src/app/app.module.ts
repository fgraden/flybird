import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { MyApp } from './app.component';
import { SettingPage } from '../pages/setting/setting';
import { RankPage } from '../pages/rank/rank';
import { GamePage } from '../pages/game/game';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { ChildHostDirective } from '../pages/tabs/childHost.directive';
import { StatusBarComponent } from '../pages/components/statusBar';
import { PopupMenuComponent } from '../pages/components/menuPopup';

import { UsersService, FrontDb } from '../services/usersService';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//enableProdMode();

@NgModule({
  declarations: [
    MyApp,
    SettingPage,
    RankPage,
    GamePage,
    TabsPage,
    LoginPage,
    ChildHostDirective,
    StatusBarComponent,
    PopupMenuComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp),
    BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SettingPage,
    RankPage,
    GamePage,
    TabsPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsersService,
    FrontDb
  ]
})
export class AppModule {}
