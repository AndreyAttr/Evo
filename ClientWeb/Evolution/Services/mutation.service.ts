import { Injectable } from '@angular/core';
import Gene from "../Models/gene";
import {SiteEnum} from "../Enums/site-enum";
import Site from "../Models/site";
import {Resolvable} from "../Abstract/resolvable";

@Injectable()
export default class MutationService implements Resolvable{

    constructor(public isEnabled: boolean) { }

    mutateGene(gene: Gene): Gene{
        if(this.isEnabled){
            let mutationIndex: number;
            let sitesLength = gene.sites.length;
            while(true)
            {
                let index = Math.round(Math.random() * 100);
                if (index < sitesLength)
                {
                    mutationIndex = index;
                    break;
                }
            }

            gene.sites.forEach(genome => {
                let tmp = new Site();
                tmp.site = genome.site;
                gene.mutationSites.push(tmp)});

            gene.mutationSites[mutationIndex] = this.mutateSite(gene.mutationSites[mutationIndex]);
        }
        return gene;
    }

    mutateSite(site: Site): Site{
        switch(site.site){
            case SiteEnum.A:
                site.site = SiteEnum.C;
                break;
            case SiteEnum.C:
                site.site = SiteEnum.G;
                break;
            case SiteEnum.G:
                site.site = SiteEnum.T;
                break;
            case SiteEnum.T:
                site.site = SiteEnum.U;
                break;
            case SiteEnum.U:
                site.site = SiteEnum.A;
                break;
        }
        site.isMutated = true;
        return site;
    }
}