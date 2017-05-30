/// <reference path="../typings/molecules.d.ts" />

import {Component, OnInit} from '@angular/core';
import {SiteInteractionService} from "../Services/site-interaction.service";
import {DnaComponent} from "../Abstract/DnaComponent";
import {SiteEnum} from "../Enums/site-enum";
import {DnaEnum} from "../Enums/dna-enum";
import {Molecule} from "../../Libraries/Molvwr/molecule";
import * as helper from '../../Webpack/helpers/path.helper';
//import * as MoleculeViewer from '../../Libraries/Molvwr/molvwr');



//let Adenine = require( '../Molecules/A.pdb');
import A from '../Molecules/A.pdb';
import C from '../Molecules/C.pdb';
//let Adenine = require("expose-loader?a!../Molecules/A.pdb");
import aTxt from 'raw-loader!../Molecules/A.pdb';
import cTxt from 'raw-loader!../Molecules/G.pdb';



//https://github.com/webpack-contrib/bundle-loader
let loadG = require("bundle-loader?lazy&name=[name]!../Molecules/G.pdb");
let strT = require('includes-loader!../Molecules/T.pdb');


//require('../../Libraries/Molvwr/hand');
//require('expose-loader?HANDJS!../../Libraries/Molvwr/hand');

//let BABYLON = require('exports-loader?BABYLON!../../Libraries/Molvwr/babylon');
let BABYLON = require("expose-loader?BABYLON!../../Libraries/Molvwr/babylon");
//let Molvwr = require('../../Libraries/Molvwr/molvwr');
//import * as MoleculeViewer from '../../Libraries/Molvwr/molvwr');

//require("expose-loader?BABYLON!../../Libraries/Molvwr/molvwr");
let MoleculeViewer = require("exports-loader?Molvwr,BabylonContext=Molvwr.BabylonContext!../../Libraries/Molvwr/molvwr");
let $ = require("expose-loader?$!jquery");


/*
NOTE: leading -!(before raw-loader) is prepended to ignore other preLoaders and loaders configured by webpack
 adding ! to a request will disable configured preLoaders
     require("!raw!./script.coffee")
 adding !! to a request will disable all loaders specified in the configuration
    require("!!raw!./script.coffee")
 adding -! to a request will disable configured preLoaders and loaders but not the postLoaders
    require("-!raw!./script.coffee")
 */
const Adenine = require('-!raw-loader!../Molecules/A.mol');
import * as Cytosine from '-!raw-loader!../Molecules/C.mol';
const Guanine  = require('-!raw-loader!../Molecules/G.mol');
import * as Thymine from '-!raw-loader!../Molecules/T.mol';
const Uracil = require('-!raw-loader!../Molecules/U.mol');

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

        // The chunk is not requested(with option 'lazy') until you call the load function:
        loadG(function(file: string) {
            // use file like it was required with
            // var file = require("./file.js");
            console.log(`Molecule PDB file: ${file} has been downloaded.`);
        });
    }

    private displayMolecule(molecule: SiteEnum | DnaEnum) {
        const moleculeData = this.getMoleculeData(molecule);
        let el = $("#moleculeViewer").get(0);
        $(el).attr('data-molvwr', moleculeData.url);
        $(el).attr('data-molvwr-format', moleculeData.format);
        MoleculeViewer.BABYLON = BABYLON;
        MoleculeViewer.Molvwr.process(el,
            (molecule:Molecule) => {
                if(molecule.formula)
                    molecule.formula = molecule.formula.replace(/ /g, '');  //https://stackoverflow.com/a/2116614
                this.siteInteraction.moleculaDisplay(molecule);
            });
    }

    private getMoleculeData(molecule: SiteEnum|DnaEnum){
        // const arginine = 'https://raw.githubusercontent.com/gleborgne/molvwr/master/demo%20website/molsamples/pdb/aminoacids/arginine.txt';
        // const dna = 'https://raw.githubusercontent.com/gleborgne/molvwr/master/demo%20website/molsamples/pdb/dna.txt';
        // const diamond = 'https://raw.githubusercontent.com/gleborgne/molvwr/master/demo%20website/molsamples/pdb/diamond.txt';

        // for (let dna in DnaEnum) {
        //     dna.
        // }

        //if(typeof molecule == "DnaEnum")
        let url, format: string;
        if (molecule > 4) {   //TODO: fix this condition to work with enums
            url = '../Evolution/Molecules/dna.pdb';
            format ='pdb';
        }
        else{
            switch (molecule)
            {
                case SiteEnum.A: url = Adenine; break;
                case SiteEnum.C: url = Cytosine; break;
                case SiteEnum.G: url = Guanine; break;
                case SiteEnum.T: url = Thymine; break;
                case SiteEnum.U: url = Uracil; break;
                default:
                    //Otherwise - using URL to download data:
                    url = `../Evolution/Molecules/${SiteEnum[molecule]}.mol`;
                    //url = `Evolution/Molecules/${SiteEnum[molecule]}.mol`;
                    //url = helper.root(`Evolution/Molecules/${SiteEnum[molecule]}.mol`);
                    break;
            }
            format = 'mol';
        }
        return {url: url, format: format};
    }
}
