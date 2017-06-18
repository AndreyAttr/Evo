import Site from "./site";
import {Injectable, Optional} from "@angular/core";

@Injectable()       //Note: to make class accessible by using constructor with params in Angular
export default class Gene {
    sites: Site[] = [];
    mutationSites: Site[] = [];
    name: string;
    description: string;


    // get sites(): SiteEnum[] {
    //     return this._sites;
    // }
    // set sites(value: SiteEnum[]) {
    //     this._sites = value;
    // }

    constructor(name: string, sites: Site[], description?: string) {
        this.name = name;
        this.sites = sites;
        this.description = description;
    }

    // constructor(parameters: {_name: string, _description: string, _sites: Site[]}) {
    //TODO: what is it? looks like spare/destruction operators, no?
    //Done: it's destruction(but actually it uses all the properties from 'parameters' object. So it's destruction, but without destruction :))
    //     let {_name, _description, _sites} = parameters; }

}