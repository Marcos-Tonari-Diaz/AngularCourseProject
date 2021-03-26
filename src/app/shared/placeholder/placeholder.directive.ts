import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[appPlaceholder]'
})
export class PlaceHolder {
    constructor(public viewContainerRef: ViewContainerRef){}
}