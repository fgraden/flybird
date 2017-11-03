import { Component, Output } from '@angular/core';
import { UsersService } from '../../services/usersService';
import { ChildComponent } from '../pageInterfaces';

@Component({
    selector: 'page-rank',
    templateUrl: 'rank.html'
})
export class RankPage implements ChildComponent{
    @Output() toPage: any;
    users: any;

    menus = [{
          id: 'login',
          label: '登陆'
      }, {
          id: 'game',
          label: "游戏"
      }
    ];


    constructor(private userservice:UsersService) {
        this.users = this.userservice.getAll();
    }

    menuSelect(pageKey: string) {
        this.toPage(pageKey);
    }
}
