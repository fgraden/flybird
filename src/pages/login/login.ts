
import {Component, Output} from "@angular/core";
import { UsersService } from '../../services/usersService';
import { ChildComponent } from '../pageInterfaces';

@Component({
	selector: 'page-login',
	templateUrl: './login.html'
})
export class LoginPage implements ChildComponent {
    @Output() toPage: any;
	toggleButtonName = "注册";
	isRegist = false;
	submitted = false;
	loginName = "";
	nameTipLable = "请输入用户名";
	showErrorMsg = false;
	errorMsg = "";

	constructor(private users:UsersService) {
	}

	toggleLabel() {
	    this.isRegist = !this.isRegist;
        this.toggleButtonName = this.isRegist ? "登陆" : "注册";
        this.nameTipLable = this.isRegist ? "起个名字吧" : "请输入用户名";
        this.submitted = false;
	}
    
    onSubmit() {
        this.submitted = true;
        if (this.isRegist) {
            this.users.registUser({
                name: this.loginName,
                rank: -1,
                count: 0
            })
        } else {
            let user = this.users.findUser(this.loginName);
            if (!user) {
                this.showErrorMsg = true;
                this.errorMsg = "没有找到用户，请先注册。";
                setTimeout(()=>{
                    this.showErrorMsg = false;
                    this.errorMsg = "";
                }, 3000);
                return;
            }
        }
        this.users.currentUser = this.loginName;
        this.toPage('game');
    }

}