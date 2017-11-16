import { Component, ViewChild, ComponentFactoryResolver, EventEmitter} from '@angular/core';

import { RankPage } from '../rank/rank';
import { GamePage } from '../game/game';
import { SettingPage } from '../setting/setting';
import { LoginPage } from '../login/login';
import { ChildHostDirective } from './childHost.directive';
import { ChildComponent } from '../pageInterfaces';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
    @ViewChild(ChildHostDirective) childHost:ChildHostDirective;
    currentPageKey: string = '';
    childPages:{[key:string]: any};

    constructor(private componentFactoryResolver: ComponentFactoryResolver) {
        this.childPages = {
            'rank': RankPage,
            'game': GamePage,
            'setting': SettingPage,
            'login': LoginPage
        }
    }

    ngAfterViewInit() {
        this.selectPage('login')
    }

    selectPage(pageKey: string) {
        if (this.currentPageKey === pageKey) {
            return;
        }
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.childPages[pageKey]);
        const viewContainerRef = this.childHost.viewContainerRef;
        viewContainerRef.clear();

        let componentRef = viewContainerRef.createComponent(componentFactory); 
        this.currentPageKey = pageKey;
        (<ChildComponent>componentRef.instance).toPage.subscribe((pageKey) => this.selectPage(pageKey));
    }
}
