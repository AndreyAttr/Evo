import {Injectable} from '@angular/core';
import MutationService from "./mutation.service";
import {DnaEnum} from "../Enums/dna-enum";
import Gene from "../Models/gene";
import {SiteEnum} from "../Enums/site-enum";
import Site from "../Models/site";
import DnaHelper from "../Helpers/dna-helper";
import {Resolvable} from "../Abstract/resolvable";

@Injectable()
export default class GeneService implements Resolvable{
    protected _gene: Gene;

    constructor(private dna: DnaEnum, private mutationService: MutationService) {
        let sites = this.getGeneSites();
        this._gene = new Gene(DnaHelper.getDnaName(this.dna), sites);
    }

    getGeneSites():Site[]{
        let sites: Site[] = [];
        for(let i=0; i<this.dna; i++ )
        {
            let site = new Site();
            let randomValue = Math.random();
            if(randomValue >= 0.8) site.site = SiteEnum.A;
            else if(randomValue >= 0.6) site.site = SiteEnum.C;
            else if(randomValue >= 0.4) site.site = SiteEnum.G;
            else if(randomValue >= 0.2) site.site = SiteEnum.T;
            else site.site = SiteEnum.U;

            sites.push(site);
        }
        return sites;
    }

    get gene(): Gene{
        if(!this.mutationService.isEnabled) return this._gene;
        let mutatedGene: Gene = this.mutationService.mutateGene(this._gene);
        return mutatedGene;
    }
}