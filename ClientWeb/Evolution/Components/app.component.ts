//Code -> Insert Live Template (Ctrl + J)
import {Component, OnInit, ViewChild} from '@angular/core';
import {AppState} from "../AppState/app-state";
import {ArrayHelper} from "../Helpers/array-helper";
import {DnaComponent} from "../Abstract/DnaComponent";
import {DnaEnum} from "../Enums/dna-enum";
import {DnaSelectorComponent} from "./dna-selector.component";
import DnaInteractionService from "../Services/dna-interaction.service";
import {SiteInteractionService} from "../Services/site-interaction.service";

@Component({
    moduleId: module.id,
    selector: 'evolution-main',
    templateUrl: '../Html/app.component.html',
    styles: [String(require('../Css/common-background.less'))],
    providers: [ArrayHelper, DnaInteractionService, SiteInteractionService]     //used into child components, but it's a helper, so must be a singleton. This is why it's here
})
export class AppComponent extends DnaComponent implements OnInit{

    constructor(private appState: AppState, private dnaInteraction: DnaInteractionService){
        super();
        this.setToogleMutationClasses();
    }

    ngOnInit(): void {
        this.mutationEnabled = this.appState.state.mutationEnabled;
        this.dnaInteraction.dnaRemoved$.subscribe(      //TODO: do we really need to subscribe in app.component? I suppose would be better to subscribe inside DnaSelectorComponent itself
            dna => this.removeFromDnaSelector(dna),
            error => this.error(error)
        );
    }

    toogleMutation() {
        this.mutationEnabled = !this.mutationEnabled;
        this.appState.state.mutationChange(this.mutationEnabled);
        this.setToogleMutationClasses();
    }

    toogleMutationClasses: {};
    setToogleMutationClasses(){
        this.toogleMutationClasses = {
            btn: true,
            'btn-primary': this.mutationEnabled,
            'btn-info': !this.mutationEnabled,
            'btn-sm': true
        };
    }

    @ViewChild(DnaSelectorComponent)        //https://metanit.com/web/angular2/2.9.php
    dnaSelectorComponent: DnaSelectorComponent;
    removeFromDnaSelector(dna:DnaEnum){
        this.dnaSelectorComponent.remove(dna);
    }
}