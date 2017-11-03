import { Component, Output} from '@angular/core';
import { NavController } from 'ionic-angular';
import { ChildComponent } from '../pageInterfaces';

@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage implements ChildComponent {
  @Output() toPage: any;

  constructor(public navCtrl: NavController) {

  }

}
