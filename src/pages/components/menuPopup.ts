
import {Component, Input, Output, EventEmitter} from "@angular/core";

@Component({
	selector: 'popup-menu-bar',
	templateUrl: './menuPopup.html'
})
export class PopupMenuComponent {
    @Input() menus: {[key:string]: string};
    @Input() buttonName: string;
    @Output() mclick:EventEmitter<any> = new EventEmitter();
    showMenu = false;
    menuHander: any;

    constructor() {
        this.menuHander = this.outSideMenuHandler.bind(this);
    }

    ngOnInit() {
        document.addEventListener('touchend', this.menuHander);
    }

    ngOnDestroy() {
        document.removeEventListener('touchend', this.menuHander);
    }

    outSideMenuHandler(event) {
        let target;
		if(!(target = event.target) || 
		   (!target.parentNode.classList.contains('menuPopup') &&
		   !target.parentNode.classList.contains('menuList'))) {
		    this.showMenu = false;
		}
    }

    menuPopup() {
        this.showMenu = true;
    }
    
    menuSelect(id: string) {
        this.mclick.emit(id);
    }
}