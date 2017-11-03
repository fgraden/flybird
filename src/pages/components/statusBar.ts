
import {Component, Input} from "@angular/core";
import { UsersService } from '../../services/usersService';

@Component({
	selector: 'user-status-bar',
	templateUrl: './statusBar.html'
})
export class StatusBarComponent {
    @Input() count: number;
    userName: string;
    rank: number;
    constructor(private users:UsersService) {
        this.userName = this.users.currentUser;
        this.rank = this.users.findUser(this.userName).rank;
    } 

}