import {Component, OnInit} from '@angular/core';
import {SiteInteractionService} from "../Services/site-interaction.service";
import {DnaComponent} from "../Abstract/DnaComponent";
import {SiteEnum} from "../Enums/site-enum";
import {DnaEnum} from "../Enums/dna-enum";
import * as helper from '../../Webpack/helpers/path.helper';
//import * as MoleculeViewer from '../../Libraries/Molvwr/molvwr');

//require('../../Libraries/Molvwr/hand');
//require('expose-loader?HANDJS!../../Libraries/Molvwr/hand');

//let BABYLON = require('exports-loader?BABYLON!../../Libraries/Molvwr/babylon');
let BABYLON = require("expose-loader?BABYLON!../../Libraries/Molvwr/babylon");
//let Molvwr = require('../../Libraries/Molvwr/molvwr');
//import * as MoleculeViewer from '../../Libraries/Molvwr/molvwr');

//require("expose-loader?BABYLON!../../Libraries/Molvwr/molvwr");
let MoleculeViewer = require("exports-loader?Molvwr,BabylonContext=Molvwr.BabylonContext!../../Libraries/Molvwr/molvwr");
let $ = require("expose-loader?$!jquery");

@Component({
    moduleId: module.id,
    selector: 'molecule-viewer',
    templateUrl: '../Html/molecule-viewer.component.html'
})

export class MoleculeViewerComponent extends DnaComponent implements OnInit {
    constructor(private siteInteraction: SiteInteractionService) {
        super();
    }

    ngOnInit() {
        this.siteInteraction.siteHovered$.subscribe(
            site => this.displayMolecule(site),
            err => this.error(err)
        );
    }

    private displayMolecule(molecule: SiteEnum | DnaEnum) {
        let el = $("#moleculeViewer").get(0);
        // let dataMolvwrAttr = $(el).attr('data-molvwr');
        // if(dataMolvwrAttr)
        // {
            $(el).attr('data-molvwr', this.getMoleculeUrl(molecule));
        //}
        MoleculeViewer.BABYLON = BABYLON;
        MoleculeViewer.Molvwr.process();
    }

    private getMoleculeUrl(molecule: SiteEnum|DnaEnum){
        // const arginine = 'https://raw.githubusercontent.com/gleborgne/molvwr/master/demo%20website/molsamples/pdb/aminoacids/arginine.txt';
        // const dna = 'https://raw.githubusercontent.com/gleborgne/molvwr/master/demo%20website/molsamples/pdb/dna.txt';
        // const diamond = 'https://raw.githubusercontent.com/gleborgne/molvwr/master/demo%20website/molsamples/pdb/diamond.txt';

        // for (let dna in DnaEnum) {
        //     dna.
        // }

        //if(typeof molecule == "DnaEnum")
        if (molecule > 3)
            return '../Evolution/Molecules/dna.pdb';
        else{
            return `../Evolution/Molecules/${SiteEnum[molecule]}.pdb`;
            //return `Evolution/Molecules/${SiteEnum[molecule]}.pdb`;
            //return helper.root(`Evolution/Molecules/${SiteEnum[molecule]}.pdb`);
        }
    }
}
