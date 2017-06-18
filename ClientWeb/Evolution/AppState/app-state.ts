import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import {Injectable} from '@angular/core';
import 'rxjs/add/operator/distinctUntilChanged';
import {DnaEnum} from "../Enums/dna-enum";
import {Subject} from "rxjs/Subject";
import {Observable} from "rxjs/Observable";


export interface State {
// define your state here
    mutationEnabled: boolean,
    selectedDnas: DnaEnum[],
    availableDnas: Array<DnaEnum>,
    mutationChanged$?: Observable<boolean>,         //Remark: added ? to make property optional and avoid problem with its default implementation into defaultState
    mutationChange?: (enabled: boolean) => void     //Remark: added ? to make property optional and avoid problem with its default implementation into defaultState
}

const defaultState: State = {
// define your initial state here
    mutationEnabled: false,
    selectedDnas: [],
    availableDnas: [DnaEnum.Human, DnaEnum.Ape, DnaEnum.Jellyfish, DnaEnum.Worm],
    mutationChanged$: undefined,
    mutationChange: undefined   //Note: possible to use empty implementation: (enabled: boolean) => {}
}

//const _state = new BehaviorSubject<State>(defaultState);

@Injectable()
export class AppState{

    //private _state = _state;
    // changes = this._state
    //     .asObservable()
    //     .distinctUntilChanged();
    //
    // set state(state: State) {
    //     this._state.next(state);
    // }
    //
    // get state(): State {
    //     return this._state.value;
    // }
    //
    // purge() {
    //     this._state.next(defaultState);
    // }
    state = defaultState;
    private mutationChangedSource: Subject<boolean> = new Subject<boolean>();
    constructor(){
        let currentAppState:State = this.state;//_state.value;
        currentAppState.mutationChange = (enabled: boolean) => {
            //function (enabled: boolean) {
            currentAppState.mutationEnabled = enabled;
            this.mutationChangedSource.next(enabled);
        };
        currentAppState.mutationChanged$ = this.mutationChangedSource.asObservable();
    }
}