import {NgModule, Type} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import * as config from "../Config/app-config";
import LogService from "../Services/log.service";
import {AppComponent} from "../Components/app.component";
import {GeneComponent} from "../Components/gene.component";


import { removeNgStyles, createNewHosts, createInputTransfer } from '@angularclass/hmr';
import { ApplicationRef } from '@angular/core';
import { AppState } from '../AppState/app-state';
import {DnaSelectorComponent} from "../Components/dna-selector.component";
import {DnaListComponent} from "../Components/dna-list.component";
import {SiteEnum, SITE_ENUMS_TOKEN} from "../Enums/site-enum";
import {DnaEnum, DNA_ENUM_TOKEN} from "../Enums/dna-enum";
import {HighlightDirective} from "../Directives/highlight.directive";
import {MoleculeViewerComponent} from "../Components/molecule-viewer.component";

const componentDeclarations = [AppComponent, DnaListComponent, GeneComponent, DnaSelectorComponent,
    MoleculeViewerComponent];
const directiveDeclarations:Array<Type<any> | any[]> = [HighlightDirective];
const pipeDeclarations:Array<Type<any> | any[]> = [];

@NgModule({
    imports: [BrowserModule, FormsModule, RouterModule, HttpModule],
    declarations: [componentDeclarations, directiveDeclarations, pipeDeclarations],
    bootstrap: [AppComponent],
    providers: [
        AppState, LogService,
        {provide: config.APP_CONFIG_TOKEN, useValue: config.EVOLUTION_CONFIG},
        {provide: SITE_ENUMS_TOKEN, useValue:  SiteEnum},
        {provide: DNA_ENUM_TOKEN, useValue: DnaEnum}
    ]
})
export class EvolutionModule {
    constructor(public appRef: ApplicationRef, public appStore: AppState) {}
    hmrOnInit(store: any) {
        console.log('hmrOnInit generated');
        if (!store || !store.state) { return; }
        console.log('HMR store', JSON.stringify(store, null, 2));
        // restore state
        this.appStore.state = store.state;
        // restore input values
        if ('restoreInputValues' in store) { store.restoreInputValues(); }
        this.appRef.tick();
        Object.keys(store).forEach(prop => delete store[prop]);
    }
    hmrOnDestroy(store: any) {
        console.log('hmrOnDestroy generated');
        const cmpLocation = this.appRef.components.map(cmp => cmp.location.nativeElement);
        store.state = this.appStore.state;
        // recreate elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues  = createInputTransfer();
        // remove styles
        removeNgStyles();
    }
    hmrAfterDestroy(store: any) {
        console.log('hmrAfterDestroy generated');
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }
}