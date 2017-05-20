import {Directive, ElementRef, HostListener, Input} from '@angular/core';
//TODO: need to use aggregator for directive's params
//import HighlightDirectiveAggregator from "./Aggregators/highlight.directive-aggregator";

@Directive({
    selector: '[highlight]',
    inputs: ['backgroundColor:highlight']
})
export class HighlightDirective {
    //TODO: clarify how to use different @Input name (then directive selector)
    //@Input('highlight') backgroundColor: string;
    backgroundColor: string;
    @Input('highlight-params') params: {
        fontWeight?: string,
        color: string,
        opacity?: string,
        borderRadius?: string,
        border?: string,
        customClass?: string
    };
    private el: HTMLElement;
    private prevClassName: string;

    constructor(el: ElementRef) {
        this.el = el.nativeElement;
        this.prevClassName = this.el.className || this.el.getAttribute('ngclass');
    }

    @HostListener('mouseenter')
    onMouseEnter(){
        this.highlight(this.backgroundColor || '#dbdbdb', this.params);
    }
    @HostListener('mouseleave')
    onMouseLeave(){
        this.highlight(null, {color: null});
    }

    highlight(color: string,
              {color: fontColor, opacity=null, borderRadius=null, border = null, fontWeight=null, customClass:className = null } :
                  {color: string, opacity?: string, borderRadius?: string, border?: string, fontWeight?: string, customClass?: string} =
                  {color: null}){
        this.el.style.backgroundColor = color;
        this.el.style.color = fontColor;
        this.el.style.border = border;
        this.el.style.borderRadius = borderRadius;
        this.el.style.opacity = opacity;// opacity || '1';  //check null
        //name!.charAt(0)   //removes null and undefined from the type of name
        this.el.style.fontWeight = fontWeight;
        this.el.className = !className && this.prevClassName ? this.prevClassName : className;
    }
}