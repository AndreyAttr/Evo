import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import Gene from "../Models/gene";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {BaseGeneComponent} from "../Abstract/base-gene.component";
import Site from "../Models/site";
import GeneInteractionService from "../Services/gene-interaction.service";
import {Observable} from "rxjs/Observable";


@Component({
    moduleId: module.id,
    selector: 'gene-editor',
    styles: [String(require('../Css/gene-editor.component.less'))],
    templateUrl: '../Html/gene-editor.component.html'
})

export class GeneEditorComponent extends BaseGeneComponent implements OnInit, OnDestroy {
    private currentChosenSite: Site;
    //get diagnostic(){return JSON.stringify(this.gene);}
    private gene: Gene = new Gene('', [], '');      //TODO: create DI factory to initialize constructor of Gene with this empty values and then use it in component's constructor
    private validationMessageClasses = 'alert alert-danger';
    private submitted = false;
    private validationSettings = {
        minlength: 3,
        maxlength: 10
    };


    private routerSubscription: Subscription;
    private querySubscription: Subscription;
    constructor(private activeRoute: ActivatedRoute, private geneInteraction: GeneInteractionService) {
        super();
        //https://metanit.com/web/angular2/7.3.php
        //this.gene.name = activeRoute.snapshot.params['geneName'];
        //http://disq.us/p/1ebfmd9
        /*Remark: Angular creates only one instance of GeneEditorComponent to process all the routes connected with
        Remark: this component. So to catch router's params changes we use subscription onto changing router's parameter*/
        //https://angular.io/guide/router#observable-params-and-component-reuse
        //Quote: By default, the router re-uses a component instance when it re-navigates to the same component type without visiting a different component first. The route parameters could change each time.
        this.routerSubscription = activeRoute.params.subscribe((params:Params) => this.gene.name=params['geneName']);
        this.querySubscription = activeRoute.queryParams.subscribe((params: Params) => {
            this.gene.description = params['description'];
            this.gene.sites = [];       //cleaning sites array to prevent accumulation if we use two links which route to this component and switch between them
            if(params['sites']) {
                let sites = JSON.parse(params['sites'].replace(/'/g, '"'));
                //https://learn.javascript.ru/array-iteration
                sites.forEach((site: any) => {           //map - to transform array to array of other items
                    this.gene.sites.push(<Site>site);
                });
                this.currentChosenSite = this.gene.sites[0];
            }
            else this.currentChosenSite = undefined;
        });

        // (+) converts string 'id' to a number
        //+params['id']
    }

    ngOnDestroy(): void {
        //http://disq.us/p/1jkl0a7 - it's possible to do not unsubscribe:
        /*Quote:
         https://angular.io/guide/router#observable-params-and-component-reuse
         When subscribing to an observable in a component, you almost always arrange to unsubscribe when the component is destroyed.
         There are a few exceptional observables where this is not necessary. The ActivatedRoute observables are among the exceptions.
         The ActivatedRoute and its observables are insulated from the Router itself. The Router destroys a routed component when it is no longer needed and the injected ActivatedRoute dies with it.
         Feel free to unsubscribe anyway. It is harmless and never a bad practice.
         */
        this.routerSubscription.unsubscribe();
        this.querySubscription.unsubscribe();
    }

    @ViewChild('editorForm')
    private editorForm: HTMLFormElement;
    ngOnInit(): void {
        this.geneInteraction.additionSuccessed$.subscribe(success => {
            if (success)
                //Remark: cleans form AND because this.gene bounded to form by [(ngModel)]="gene.name" etc. it sets all the gene properties to NULL and
                //Remark: also sets this.currentChosenSite which is also bounded(so do not need to clean up it manually):
                this.editorForm.reset()
        });
    }

    add(){
        //Note: Using local LET variable to prevent setting all the this.gene properties to NULL when we reset the form
        let gene = new Gene(this.gene.name, [this.currentChosenSite], this.gene.description);
        this.geneInteraction.add(gene);
    }
    onSubmit(){
        this.submitted = true;
    }
}
