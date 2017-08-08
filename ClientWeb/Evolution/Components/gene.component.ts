import {
    Component, OnInit, Inject, Optional, Injector, EventEmitter, OnDestroy
} from '@angular/core';
//Note: LogService - it's exported class by default, CustomLog - just exported class
import LogService, {CustomLog} from "../Services/log.service";
import {APP_CONFIG_TOKEN, AppConfig} from "../Config/app-config";
import GeneService from "../Services/gene.service";
import MutationService from "../Services/mutation.service";
import {mutationServiceProvider} from "../Providers/mutation-service-provider";
import Gene from "../Models/gene";
import {geneServiceProvider} from "../Providers/gene-service-provider";
//import {GeneEnum, GENE_ENUM_TOKEN} from "../Enums/gene-enum";
import Site from "../Models/site";
import {AppState} from "../AppState/app-state";
import DI from "../Helpers/di-helper";
import {SiteEnum, SITE_ENUMS_TOKEN} from "../Enums/site-enum";
import {Subscription} from "rxjs/Subscription";
import {BaseGeneComponent} from "../Abstract/base-gene.component";
import {Molecule} from "../../Libraries/Molvwr/molecule";
import {
    RemoveGeneInteractionMultiCastEventToken,
    SiteInteractionToken
} from "../Services/di-interaction-service-tokens";
import ObjectHelper from "../Helpers/object-helper";
import {ArrayHelper} from "../Helpers/array-helper";
import {ManuallyCast} from "../Abstract/manually-cast";

@Component({
    moduleId: module.id,
    selector: 'gene-component',
    templateUrl: '../Html/gene.component.html',
    styles: [String(require('../Css/gene.component.less'))],
    //only when they are here - it will create new instance of this component every time:
    providers: [geneServiceProvider, mutationServiceProvider, Gene],
    inputs: ['gene'],
    //outputs: ['removeEvent:remove']
})
export class GeneComponent extends BaseGeneComponent implements OnInit, OnDestroy, ManuallyCast<Site> {
    // @Input() dna: GeneEnum;
    // @Output('remove') removeEvent = new EventEmitter<GeneEnum>();
    gene: Gene;
    molecule: Molecule;
    kinds: string[];
    private moleculaDisplayed: Subscription;
    private mutationChanged:Subscription;

    constructor(@Optional() protected log: LogService,
                private geneRemovedEvent: RemoveGeneInteractionMultiCastEventToken<Gene>,
                private siteInteraction: SiteInteractionToken<SiteEnum|Gene, Molecule>,
                @Inject(APP_CONFIG_TOKEN) protected config: AppConfig,
                private appState: AppState,
                //private geneService: GeneService,
                //@Inject(SITE_ENUMS_TOKEN) protected siteEnum: SiteEnum,
                private injector: Injector) {
        super();
    }

    manuallyCastTo(source: any): Site[] {
        //Workaround: when we do deep copy of some item with ObjectHelper.deepCopy(), it stores the structure of tree of properties.
        //Workaround: BUT it also looses the typing, so the structure is the same, but it's anonimous type. And if original type has
        //Workaround: some computable property, it's lost in anonimous type. It's exactly what happens with Site.name computable prop.
        //Done: So, to fix this problem created interface ManuallyCast which contains this method manuallyCast and the solution is
        //Done: RE-CREATING original type by using data from anonimous type that we have. It's workaround but I have doubts the problem
        //Done: maybe resolved any different way:
        return source.map((item:Site) => new Site(item.site, item.isMutated));
    }

    private getMutationService(appState?: AppState):MutationService{
        //This function is slower than the corresponding fromResolvedProviders because it needs to resolve the passed-in providers first
        //let injector: ReflectiveInjector = ReflectiveInjector.resolveAndCreate([mutationServiceProvider, AppState]);        //using this way of DI demands specifying all DI three: mutationServiceProvider use mutationServiceFactory which depends on AppState, so I specified AppState too.
        //let mutationService = this.injector.get(MutationService);

        //This is faster then previous
        // let resolvedProviders = ReflectiveInjector.resolve([mutationServiceProvider, AppState]);        //using this way of DI demands specifying all DI three: mutationServiceProvider use mutationServiceFactory which depends on AppState, so I specified AppState too.
        // let injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);
        // let mutationService = injector.get(MutationService);
        return DI.resolve<MutationService>(MutationService, [mutationServiceProvider,
            {provide: AppState, useValue: this.appState}]);       //using this way of DI demands specifying all DI three: mutationServiceProvider use mutationServiceFactory which depends on AppState, so I specified AppState too(even inspite of the fact that AppState is already specified into EvolutionModule).
    }
    private getGeneService():GeneService{
        //DONE: find a way how to use GeneService properly(maybe without DI, using constructor with params)
        //let geneService = this.injector.get(GeneService, "Error: GeneService can't be injected into GeneComponent!");
        //let allDnaEnumeration = this.injector.get(GENE_ENUM_TOKEN);
        this.gene.sites = this.manuallyCastTo(this.gene.sites);                     //workaround
        this.gene.mutationSites = this.manuallyCastTo(this.gene.mutationSites);     //workaround
        return DI.resolve<GeneService>(GeneService, geneServiceProvider, {provide: Gene, useValue: this.gene},//{provide: GENE_ENUM_TOKEN, useValue: this.dna},
            {provide: MutationService, useValue: this.getMutationService()});
    }
    private initGene(){
        let geneService = this.getGeneService();
        this.gene = geneService.gene;
        //this.log.info(JSON.stringify(this.gene));
    }

    ngOnInit() {
        this.initGene();

        if (this.log) {
            let css = ['background: linear-gradient(#75ff5a, #178004)', 'border: 1px solid #3E0E02',
                'color: white', 'display: block', 'text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)',
                'box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset',
                'line-height: 40px', 'text-align: center', 'font-size: 18px', 'font-weight: bold', 'font-style: italic'];
            this.log.log(new CustomLog(`Gene ${this.gene.name} created!!!`, css));
            this.log.info(new CustomLog(`Gene ${this.gene.name} created!!!`));
        }

        this.moleculaDisplayed = this.siteInteraction.confirmed$.subscribe(
            (molecule) => {
                this.molecule = molecule;
                this.kinds = [];
                for(let prop in molecule.kinds){
                    this.kinds.push(prop);
                }
            },
            err => this.error(err),
            () => {
                //TODO: never come in here
                alert('Molecule formula and atoms have been displayed.');
            }
        );

        // const reinitializeGene: () => void = this.initGene;      //aliasing
        // const subsribeAgain: (enabled: boolean) => void = (enabled) => {
        //     //Note: call() & apply() allow to bind fuction to specific context and then immediately execute the function:
        //     reinitializeGene.call(this);    //https://metanit.com/web/javascript/4.10.php
        //
        //     /*Remark: each time in reinitializeGene() we recreate GeneService which demands MutationService which demands
        //      * Remark: new instance of AppState. Each time! So really we create NEW instance of AppState each time we create
        //      * Remark: GeneService. But we DO NOT subscibe on .mutationChanged$ event of that NEW instance of AppState. So,
        //      * Remark: we must REsubscribe on event of NEW generated AppState each time.*/
        //     //Note: bind() just allow to bind function to specific context, but doesn't start execution:
        //     this.appState.state.mutationChanged$.subscribe(subsribeAgain.bind(this));   //https://metanit.com/web/javascript/4.10.php
        // };
        this.mutationChanged = this.appState.state.mutationChanged$.subscribe(
            enabled => this.switchMutation()(enabled),
            err => this.error(err)
        );
    }
    private switchMutation(mutationSites?: Site[]) : (enabled:boolean)=>void{
        if(mutationSites)
            this.gene.mutationSites = this.manuallyCastTo(mutationSites);   //workaround
        return enabled => {
            this.mutationEnabled = enabled;
        };
    }

    ngOnDestroy(): void {
        let slides: string[] = [];
        let direction: boolean = true;
        for(let i =0, j=-1; i < 360; i+=6){
            slides.push(`${j}px ${j}px hsl(${i}, 100%, 50%),`);     //http://webremeslo.ru/css3/glava4.html
            if(direction) j++;
            else j--;
            if(i % 60 === 0) direction = !direction;
        }
        // for(let i =0, j=-1, k=-1; i < 360; i+=12, j++){
        //     slides.push(`${k}px ${j}px hsl(${i}, 100%, 50%),`);
        //     if(direction) k++;
        //     else i--;
        //     if(i % 120 === 0) direction = !direction;
        // }
        let lastComaIndex = slides[slides.length-1].lastIndexOf(',');
        slides[slides.length-1] = slides[slides.length-1].substr(0, lastComaIndex).concat(';');
        let css = 'text-shadow: '.concat(...slides, 'font-size: 20px;');
        //let css = "text-shadow: -1px -1px hsl(0,100%,50%), 1px 1px hsl(6, 100%, 50%), 3px 2px hsl(12, 100%, 50%), 5px 3px hsl(18, 100%, 50%), 7px 4px hsl(24, 100%, 50%), 9px 5px hsl(30, 100%, 50%), 11px 6px hsl(36, 100%, 50%), 13px 7px hsl(42, 100%, 50%), 14px 8px hsl(48, 100%, 50%), 16px 9px hsl(54, 100%, 50%), 18px 10px hsl(60, 100%, 50%), 20px 11px hsl(66, 100%, 50%), 22px 12px hsl(72, 100%, 50%), 23px 13px hsl(78, 100%, 50%), 25px 14px hsl(84, 100%, 50%), 27px 15px hsl(90, 100%, 50%), 28px 16px hsl(96, 100%, 50%), 30px 17px hsl(102, 100%, 50%), 32px 18px hsl(108, 100%, 50%), 33px 19px hsl(114, 100%, 50%), 35px 20px hsl(120, 100%, 50%), 36px 21px hsl(126, 100%, 50%), 38px 22px hsl(132, 100%, 50%), 39px 23px hsl(138, 100%, 50%), 41px 24px hsl(144, 100%, 50%), 42px 25px hsl(150, 100%, 50%), 43px 26px hsl(156, 100%, 50%), 45px 27px hsl(162, 100%, 50%), 46px 28px hsl(168, 100%, 50%), 47px 29px hsl(174, 100%, 50%), 48px 30px hsl(180, 100%, 50%), 49px 31px hsl(186, 100%, 50%), 50px 32px hsl(192, 100%, 50%), 51px 33px hsl(200, 100%, 50%), 52px 34px hsl(206, 100%, 50%), 53px 35px hsl(212, 100%, 50%); font-size: 20px;";
        this.log.log(new CustomLog(`Gene ${this.gene.name} is destroyed!`, css));

        //Unsubscribe
        this.moleculaDisplayed.unsubscribe();
        this.mutationChanged.unsubscribe();
    }

    mutateGene(event: Event){
        this.stopPropagation(event);
        this.mutationEnabled = !this.mutationEnabled;
    }

    removeGene(){
        //this.removeEvent.emit(this.dna);
        this.geneRemovedEvent.event(this.gene);
    }

    siteClicked(event: MouseEvent, molecule: SiteEnum|Gene){
        this.stopPropagation(event);
        this.siteInteraction.event(molecule);
    }
    mutateSite(event: MouseEvent, site: Site){
        this.stopPropagation(event);
        this.getMutationService().mutateSite(site);
    }

}
