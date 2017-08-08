import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import Gene from "../Models/gene";
import {ActivatedRoute, Params} from "@angular/router";
import {Subscription} from "rxjs/Subscription";
import {BaseGeneComponent} from "../Abstract/base-gene.component";
import Site from "../Models/site";
import {SiteEnum} from "../Enums/site-enum";
import {GeneInteractionToken} from "../Services/di-interaction-service-tokens";
import ObjectHelper from "../Helpers/object-helper";


@Component({
    moduleId: module.id,
    selector: 'gene-editor',
    styles: [String(require('../Css/validation.less'))],
    templateUrl: '../Html/gene-editor.component.html',
    providers: [{provide: Gene, useValue: new Gene('', [], '')}]        //https://angular.io/guide/dependency-injection-in-action#the-provide-object-literal
})

export class GeneEditorComponent extends BaseGeneComponent implements OnInit, OnDestroy {
    private currentChosenSite: Site;
    //get diagnostic(){return JSON.stringify(this.gene);}
    private validationMessageClasses = 'alert alert-danger';
    private submitted = false;
    private validationSettings = {
        minlength: 3,
        maxlength: 10
    };


    private routerSubscription: Subscription;
    private querySubscription: Subscription;
    private confirmed:Subscription;
    constructor(private activeRoute: ActivatedRoute, private geneInteraction: GeneInteractionToken<Gene, boolean>, private gene:Gene) {
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
            if(params['siteEnums']) {
                let siteEnums = JSON.parse(params['siteEnums'].replace(/'/g, '"'));
                //https://learn.javascript.ru/array-iteration
                siteEnums.forEach((se: {site:SiteEnum}) => {           //map - to transform array to array of other items
                    this.gene.sites.push(new Site(se.site));
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
        //but unsubscribing from Observables you subscribed by your own - it'a a MUST:
        this.confirmed.unsubscribe();
    }

    @ViewChild('editorForm')
    private editorForm: HTMLFormElement;
    ngOnInit(): void {
        this.confirmed = this.geneInteraction.confirmed$.subscribe(success => {
            if (success)
                //Remark: cleans form AND because this.gene bounded to form by [(ngModel)]="gene.name" etc. it sets all the gene properties to NULL and
                //Remark: also sets this.currentChosenSite which is also bounded(so do not need to clean up it manually):
                this.editorForm.reset();
        });
    }

    add(){
        this.gene.sites = [this.currentChosenSite];
        //Note: Using deepCopy of instance (may use also local LET variable - but it's workaround) to prevent setting all the this.gene properties to NULL when we reset the form
        const gene = ObjectHelper.deepCopy(this.gene) as Gene;
        this.geneInteraction.event(gene);
    }
    onSubmit(){
        this.submitted = true;
    }
}
