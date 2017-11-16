import { Component, Output, EventEmitter } from '@angular/core';
import { NavController } from 'ionic-angular';
import {Flybird} from '../../lib/flybird';
import { ChildComponent } from '../pageInterfaces';
import { UsersService } from '../../services/usersService';

import {trigger, state, style, animate, transition, keyframes} from '@angular/animations';

@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
  animations: [
      trigger('timingAnimate',[
          state('state3', style({opacity:1, transform: 'scale(1)'})),
          state('state2', style({opacity:1, transform: 'scale(1)'})),
          state('state1', style({opacity:1, transform: 'scale(1)'})),
          state('*', style({opacity:1, transform: 'scale(1)'})),
          transition("*<=>*", [
              animate(1000, keyframes([
                  style({opacity:1, transform: 'scale(1)', offset: 0}),
                  style({opacity:1, transform: 'scale(1.2)', offset: 0.3}),
                  style({opacity:0, transform: 'scale(0.4)', offset: 1})
              ]))
          ])
        ])
      ]
})
export class GamePage implements ChildComponent{
  @Output() toPage = new EventEmitter<string>();
  flybird: Flybird;
  showPop = false;
  showAnimate = false;
  animateLast: number;
  animateSate: string = 'a';
  count:number = 0;
  menus = [{
          id: 'rank',
          label: '排名'
      }, {
          id: 'login',
          label: '登陆'
      }, {
          id: 'game',
          label: "游戏"
      }
  ];

  constructor(public navCtrl: NavController, private users:UsersService) {
       
  }

  ngOnInit() {
      this.flybird = new Flybird();
      this.flybird.init(this);
      this.flybird.render();
      this.startAnimate()
  }

  ngOnDestroy() {
      if (this.flybird) {
          this.flybird.unload();
          this.flybird = null;
      }
  }

  startAnimate() {
      this.showAnimate = true;
      this.showPop = true;
      this.animateLast = 4;
      this.animateSate = 'state' + this.animateLast;
      
  }

  animateDone() {
      if (this.animateLast === 0) {
          this.showPop = false;
          this.showAnimate = false;
          this.flybird.start();
      } else {
          -- this.animateLast;
          this.animateSate = 'state' + this.animateLast;
      }
  }

  menuSelect(pageKey: string) {
      if(pageKey === 'game') {
          this.reGame();
          return;
      }
      this.toPage.emit(pageKey);
  }

  reGame() {
      this.count = 0;
      this.flybird.render();
      this.startAnimate();
  }

  hidePop() {
     this.showPop = false;
  }
  
  // 提供给画图回调函数
  gameOver() {
      this.showPop = true;
      this.showAnimate = false;
      this.users.saveUser({
          name: this.users.currentUser,
          rank: -1,
          count: this.count,
      });
  }

  updateCount(count: number) {
      this.count = count;
  }
}
