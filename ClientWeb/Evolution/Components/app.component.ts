//Code -> Insert Live Template (Ctrl + J)
import {Component, OnInit, ViewChild} from '@angular/core';
import {AppState} from "../AppState/app-state";
import {ArrayHelper} from "../Helpers/array-helper";
import {DnaComponent} from "../Abstract/DnaComponent";
import {DnaEnum} from "../Enums/dna-enum";
import {DnaSelectorComponent} from "./dna-selector.component";
import DnaInteractionService from "../Services/dna-interaction.service";

@Component({
    moduleId: module.id,
    selector: 'evolution-main',
    templateUrl: '../Html/app.component.html',
    providers: [ArrayHelper, DnaInteractionService]     //used into child components, but it's a helper, so must be a singleton. This is why it's here
})
export class AppComponent extends DnaComponent implements OnInit{

    constructor(private appState: AppState, private dnaInteraction: DnaInteractionService){
        super();
    }

    ngOnInit(): void {
        this.mutationEnabled = this.appState.state.mutationEnabled;
        this.dnaInteraction.dnaRemoved$.subscribe(
            dna => this.removeFromDnaSelector(dna),
            error => this.error(error));
    }

    toogleMutation() {
        this.mutationEnabled = this.appState.state.mutationEnabled = !this.mutationEnabled;
    }

    @ViewChild(DnaSelectorComponent)
    dnaSelectorComponent: DnaSelectorComponent;
    removeFromDnaSelector(dna:DnaEnum){
        this.dnaSelectorComponent.remove(dna);
    }
}