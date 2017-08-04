import {Component, EventEmitter, OnInit} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {SiteEnum} from "../Enums/site-enum";
import EnumHelper from "../Helpers/enum-helper";
import {BaseGeneComponent} from "../Abstract/base-gene.component";

@Component({
    moduleId: module.id,
    selector: 'site-mutation',
    templateUrl: '../Html/site-mutation.component.html',
    inputs: ['index', 'siteGroup'],
    outputs: ['remove']
})

export class SiteMutationComponent extends BaseGeneComponent implements OnInit {
    private index: number;
    private siteGroup: FormGroup;
    private remove: EventEmitter<Symbol> = new EventEmitter<Symbol>();
    private siteItems: Array<SiteEnum> = EnumHelper.getValues(SiteEnum);//EnumHelper.getNames(SiteEnum);

    constructor() {
        super();
    }

    ngOnInit() {
        this.setUpMutationChanges();
    }
    private labelSiteMutation(isMutatedCtrl:FormControl){
        return isMutatedCtrl.value ? 'Mutated' : 'Original';    //isMutatedCtrl - it's FormControl here(it's based on Site structure where isMutated it's one of properties)
    }
    private removeSite():void {
        const formGroupId =  this.siteGroup.controls.id.value;
        this.remove.emit(formGroupId);
    }

    //Subscribe onto changes into specific component:
    setUpMutationChanges() {
        //https://angular.io/guide/reactive-forms#observe-control-changes
        this.siteGroup.controls.site.valueChanges.forEach((value:SiteEnum)=>{   //TODO: investigate Observable<any>. Also possible to use .subscriebe() but then need to unsubscriebe
            let isMutatedCtrl = this.siteGroup.controls.isMutated;
            //isMutatedCtrl.patchValue({isMutated: true});    //https://angular.io/guide/reactive-forms#patchvalue
            isMutatedCtrl.setValue(true);    //https://angular.io/guide/reactive-forms#setvalue
        });
    }
}