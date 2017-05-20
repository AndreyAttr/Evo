import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {SiteEnum} from "../Enums/site-enum";
import {DnaEnum} from "../Enums/dna-enum";

@Injectable()
export class SiteInteractionService {
    private siteHoveredSources = new Subject<SiteEnum|DnaEnum>();
    siteHovered$ = this.siteHoveredSources.asObservable();
    siteHover(molecule: SiteEnum|DnaEnum){
        this.siteHoveredSources.next(molecule);
    }
}
