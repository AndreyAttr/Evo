import {
    Component, OnInit, Inject, Optional, Injector, EventEmitter, OnDestroy
} from '@angular/core';
import LogService from "../Services/log.service";
import {APP_CONFIG_TOKEN, AppConfig} from "../Config/app-config";
import GeneService from "../Services/gene.service";
import MutationService from "../Services/mutation.service";
import {mutationServiceProvider} from "../Providers/mutation-service-provider";
import Gene from "../Models/gene";
import {geneServiceProvider} from "../Providers/gene-service-provider";
import {DnaEnum, DNA_ENUM_TOKEN} from "../Enums/dna-enum";
import Site from "../Models/site";
import {AppState} from "../AppState/app-state";
import DI from "../Helpers/di-helper";
import {SiteEnum, SITE_ENUMS_TOKEN} from "../Enums/site-enum";
import DnaInteractionService from "../Services/dna-interaction.service";
import {Subscription} from "rxjs/Subscription";

@Component({
    moduleId: module.id,
    selector: 'gene-component',
    templateUrl: '../Html/gene.component.html',
    styles: [String(require('../Css/gene.component.less'))],
    //only when they are here - it will create new instance of this component every time:
    providers: [geneServiceProvider, mutationServiceProvider, Gene
    ],
    inputs: ['dna'],
    //outputs: ['removeEvent:remove']
})
export class GeneComponent implements OnInit, OnDestroy {
    // @Input() dna: DnaEnum;
    // @Output('remove') removeEvent = new EventEmitter<DnaEnum>();
    dna: DnaEnum;
    //removeEvent = new EventEmitter<DnaEnum>();
    gene: Gene;

    constructor(@Optional() protected log: LogService,
                private dnaInteraction: DnaInteractionService,
                @Inject(APP_CONFIG_TOKEN) protected config: AppConfig,
                //private geneService: GeneService,
                //@Inject(SITE_ENUMS_TOKEN) protected siteEnum: SiteEnum,
                private injector: Injector) { }

    ngOnInit() {
        //DONE: find a way how to use GeneService properly(maybe without DI, using constructor with params)
        //let geneService = this.injector.get(GeneService, "Error: GeneService can't be injected into GeneComponent!");
        //let allDnaEnumeration = this.injector.get(DNA_ENUM_TOKEN);
        let geneService = DI.resolve<GeneService>(GeneService, geneServiceProvider,{provide: DNA_ENUM_TOKEN, useValue: this.dna}, mutationServiceProvider, AppState);
        this.gene = geneService.gene;

        if (this.log) {
            this.log.log(`Gene ${this.gene.name} created!!!`);
            //this.log.log(`The API is ${this.config.apiEndpoint}`);
        }
    }
    ngOnDestroy(): void {
        console.log(`Gene ${this.gene.name} is destroyed!`);
    }

    mutate(site: Site){
        //This function is slower than the corresponding fromResolvedProviders because it needs to resolve the passed-in providers first
        //let injector: ReflectiveInjector = ReflectiveInjector.resolveAndCreate([mutationServiceProvider, AppState]);        //using this way of DI demands specifying all DI three: mutationServiceProvider use mutationServiceFactory which depends on AppState, so I specified AppState too.
        //let mutationService = this.injector.get(MutationService);

        //This is faster then previous
        // let resolvedProviders = ReflectiveInjector.resolve([mutationServiceProvider, AppState]);        //using this way of DI demands specifying all DI three: mutationServiceProvider use mutationServiceFactory which depends on AppState, so I specified AppState too.
        // let injector = ReflectiveInjector.fromResolvedProviders(resolvedProviders);
        // let mutationService = injector.get(MutationService);

        let mutationService = DI.resolve<MutationService>(MutationService, [mutationServiceProvider, AppState]);       //using this way of DI demands specifying all DI three: mutationServiceProvider use mutationServiceFactory which depends on AppState, so I specified AppState too.
        mutationService.mutateSite(site);
    }

    removeGene(){
        //this.removeEvent.emit(this.dna);
        this.dnaInteraction.dnaRemove(this.dna);
    }
}
