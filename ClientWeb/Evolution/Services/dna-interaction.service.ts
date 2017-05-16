import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {DnaEnum} from "../Enums/dna-enum";

@Injectable()
export default class DnaInteractionService {
    private dnaRemovedSources = new Subject<DnaEnum>();
    dnaRemoved$ = this.dnaRemovedSources.asObservable();
    dnaRemove(dna: DnaEnum){
        this.dnaRemovedSources.next(dna);
    }
}