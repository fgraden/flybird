
import {Injectable} from "@angular/core";

export interface User {
	name: string;
	rank: number;
    count: number;
}

@Injectable() 
export class FrontDb {
    constructor() {

    }

    saveDb(key: string, store: Object) {
        if (window.localStorage) {
            window.localStorage.setItem(key, JSON.stringify(store));
        }
    }

    getDb(key: string) {
        if (window.localStorage) {
            let db = window.localStorage.getItem(key);
            return db ? JSON.parse(db): false;
        }
    }
}

@Injectable() 
export class UsersService {
	users: Array<User> = [];
    private _user: string;

    constructor(private frontdb: FrontDb) {
        let users:any = this.frontdb.getDb('users_key');
        if (users) {
           this.users = users; 
        }
    }
    
    registUser(user:User) {
        if (this.users.find(u=>(user.name === u.name))) {
            return false;
        }
        this.users.push(user);
        this.updateUsers(user);
        return true;
    }

    findUser(name:string) {
        return this.users.find(u=>(name === u.name));
    }

    getAll() {
        return this.users;
    }

    saveUser(user:User) {
        let foundUser;
        if (foundUser = this.users.find(u=>(user.name === u.name))) {
            if(user.count > foundUser.count) {
                foundUser.count = user.count;
                this.updateUsers(user);
            }
        }
    }

    updateUsers(user: User) {
        this.users.sort((u1, u2)=>{
            if (u1.count > u2.count) {
                return -1;
            } else if(u1.count == u2.count) {
                return 0;
            } else {
                return 1;
            }
        });
        this.users.forEach((u, index)=>{
            u.rank = index + 1;
        });
        this.frontdb.saveDb('users_key', this.users);
    }

    get currentUser() {
        return this._user;
    }
    set currentUser(u: string) {
        this._user = u;
    }
}
