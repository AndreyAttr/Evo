import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {SiteEnum} from "../Enums/site-enum";
import {DnaEnum} from "../Enums/dna-enum";
import {Molecule} from "../../Libraries/Molvwr/molecule";

@Injectable()
export class SiteInteractionService {
    private siteClickedSources = new Subject<SiteEnum|DnaEnum>();
    siteClicked$ = this.siteClickedSources.asObservable();
    siteClick(molecule: SiteEnum|DnaEnum){
        this.siteClickedSources.next(molecule);
    }

    private moleculaDisplaySources = new Subject<Molecule>();
    moleculaDisplayed$ = this.moleculaDisplaySources.asObservable();
    moleculaDisplay(molecule: Molecule){
        this.moleculaDisplaySources.next(molecule);
    }
}
