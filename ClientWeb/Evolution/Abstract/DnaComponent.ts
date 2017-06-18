import {DnaEnum} from "../Enums/dna-enum";
import {Input} from "@angular/core";
import DnaHelper from "../Helpers/dna-helper";

export abstract class DnaComponent {
    @Input() mutationEnabled: boolean = false;

    getDnaName(dna:DnaEnum):string{
        return DnaHelper.getDnaName(dna);
    }

    //The never type represents the type of values that never occur.        https://www.typescriptlang.org/docs/handbook/basic-types.html
    error(message: string): never;
    error(message: Error): never;
    error(message: string | Error): never{
        if (typeof message == 'string')
            throw new Error(message);
        else if(message instanceof Error)
            throw message;

        //Function returning 'never' cannot have a reachable end point. So, do it unreachable:
        const errorMessage = `Unknown error ${message}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }
}