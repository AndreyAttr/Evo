import {Component, EventEmitter, Input, Output} from '@angular/core';
import Gene from "../Models/gene";
import {BaseGeneComponent} from "../Abstract/base-gene.component";

@Component({
    moduleId: module.id,
    selector: 'gene-submitted',
    templateUrl: '../Html/gene-submitted.component.html',
    inputs: ['gene']
})

export class GeneSubmittedComponent extends BaseGeneComponent {
    private gene: Gene;
    @Input() submitted:boolean = false;
    @Output() submittedChange = new EventEmitter<boolean>();
    constructor() {
        super();
    }

    onClick() {this.submittedChange.emit(false);}
}