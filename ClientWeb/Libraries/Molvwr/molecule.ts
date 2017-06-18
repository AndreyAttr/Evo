export interface Molecule {
    title: string;
    formula: string;
    atoms: Array<any>;
    kinds: Array<any>;
};
//Remark: Merging class & interface here(without interface implementation)
export class Molecule{
    atoms = [];
    kinds = [];
}
export class Kind{
    name: string;
    symbol: string;
    rgb: string;
    invertedRGB: string;
}

//Also this module will be exported to molvwr.js, so using CommonJs module exports
module.exports = Molecule;

//TODO: clarify why need to use CommonJs approach(module.exports) for using Molecule in Molvwr.js if classes has been exportet with EXPORT CLASS - to use Molecule into Angular Components
//TODO: what the differences between import and require on ES6 - it cause error in Molvwr when IMPORT is used(https://stackoverflow.com/a/41300677)