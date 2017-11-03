import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
	selector: '[child-host]'
})
export class ChildHostDirective {
	constructor(public viewContainerRef:ViewContainerRef) {

	}
}