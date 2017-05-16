import {Component, EventEmitter, Output} from '@angular/core';
import {AppState} from "../AppState/app-state";
import {DnaComponent} from "../Abstract/DnaComponent";
import {DnaEnum} from "../Enums/dna-enum";

@Component({
    moduleId: module.id,
    selector: 'dna-list-component',
    templateUrl: '../Html/dna-list.component.html'
})
export class DnaListComponent extends DnaComponent {

    constructor(private appState: AppState) {
        super();
    }

    get dnaList(){
        return this.appState.state.selectedDnas;
    }
}