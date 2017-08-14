import ObjectHelper from "../Helpers/object-helper";
import {Constructable} from "../Abstract/constructable";

export interface IArray<T>{
    [key: number]: T;
}

//
export interface IDictionary<T>{
    [key: string]: T;                         //Remark: doesn't needed if we extends from IndexedType<T>
}
// interface IDictionaryFunctions<T>{
//     [key: string]: (exclude: boolean)=>T;           //string literal object(type)/associative array/string indexed object(interface)/dictionary which values are functions
// }
// interface IKeyValuePair<T>{
//     keyValuePairs: {key: T}[];
// }

//Impossible to cast to interface(IDictionary), so needed class for that purpose
class Dictionary<T> implements IDictionary<T>{
    [key: string]: T;       //https://stackoverflow.com/a/35370453
    constructor(...items:T[]){}
}

//interface IDictionaryArray<T> extends IDictionary<T>, IArray<T>{      //TODO: [key: number | string]: T; - and when it will be implemented - no dictionary/array/lenght are needed anymore
interface IDictionaryArray<T> {
    dictionary: Dictionary<T>;
    array: Array<T>;
    length: number;

    //TODO: constructor annotation in interface
    //new (source: IDictionary<T> | Array<T>): IDictionaryArray<T>;
    //Done: imposible to implement - see Contstructable
}

export type KeyValuePair<T> = {keyIndex: number|string, value: T};
export type Predicate<T> = (item:T)=>boolean;
export type Selector<T> = (item:T)=>string;
type KeyValuePairTransformer<T> = (item:T)=>KeyValuePair<T>;
export type ArrayMapper<T> = {mapper: KeyValuePairTransformer<T>};
export type ArrayConverter<T> = Array<T> & ArrayMapper<T>;    //type aliasing together with intersection types(&)
//Remark: need to put cursor to Condition<...> and press Ctrl + Q to see this info:
/**
 * Condition of removing item
 * @param value Represent a item to remove
 * @param predicate Function to set up condition of checking that @value exists in the DictionaryArray<T>
 * @param selector Function to adjust how to get key(string) to remove item from DictionaryArray<T>
 */
export type Condition<T> = {value: T, predicate: Predicate<T>, selector: Selector<T>};

export default class DictionaryArray<T> implements IDictionaryArray<T>{
    //private source: { [index:string]: T; } | { [index:number]: T; };      //it's possible to use this object notation
    private source: Dictionary<T> | Array<T>;
    get dictionary(): Dictionary<T>{return this.toDictionary();}
    get array(): Array<T>{return this.toArray();}

    //mixin(intersection of types T1 & T2)
    static convertArray<T, T1 extends Array<T>, T2 extends ArrayMapper<T>>(instance1: T1, instance2: T2) : T1 & T2 {
        return ObjectHelper.mixin(instance1, instance2);
    }

    //User-Defined Type Guards - https://www.typescriptlang.org/docs/handbook/advanced-types.html
    isArrayConverter(source: IDictionary<T> | ArrayConverter<T>): source is ArrayConverter<T>{
        return (<ArrayConverter<T>>source).mapper !== undefined;
    }

    constructor(source: IDictionary<T> | ArrayConverter<T>){
        if(this.isArrayConverter(source)){
            this.source = {};
            let {mapper, ...array} : {mapper: KeyValuePairTransformer<T>} = source;     //Note: destruction - https://www.typescriptlang.org/docs/handbook/variable-declarations.html
            //array it's literal object now, it's not array. So we say we need to cast to Array from literal object:
            array = ObjectHelper.cast(Array, array);        //transform object literal (which properties are items of array) to array
            if(array instanceof Array) {
                array.map(item => {
                    const keyValuePair: KeyValuePair<T> = mapper(item);
                    this.add(keyValuePair);
                });
                //Object.keys(array).map((item: string) => mapper((<Array<T>>array)[item as any])).forEach(keyValuePair => this.add(keyValuePair)); //do the same
            }
            // else     //Workaround: in case if we do not get array from mixin
            //     Object.keys(source)
            //         .filter(p => p !== 'mapper')        //exclude mapper mixin's property from source array items(separation of mixin here)
            //         .map(p => source.mapper(source[p as any]))
            //         .forEach(keyValuePair => this.add(keyValuePair));
        }
        else
            this.source = source;
    }

    get length(): number{
        return this.array ? this.array.length : 0;
    }

    private get checkSource(){return this.source != undefined && this.source != null;}

    private toArray(): T[]{
        if(!this.checkSource) return [];
        // let array:any = this.source;    //Note: this additional extra line of code needed because in tsconfig.json we have "noImplicitAny": true option
        // return Object.keys(array).map(prop => array[prop]);      //works
        return ObjectHelper.decomposeToArray(this.source);          //the same but generic

        //return ObjectHelper.cast<typeof Array, any>(Array, this.source);          //it will be smt. strange - Array(0) with no items, but with properties which must have been items :)))) But no items in array!
        //return this.source as T[];                                                //it will be literal object - type assertion itself can't return typing
    }

    private toDictionary(): Dictionary<T>/*{[key: string]: T}*/ {
        if(!this.checkSource) return {};
        return this.source as {[key: string]: T};   //transformation to indexed object
    }

    //Sample of call:
    //Using types:
    // let dict = this.cast<Dictionary<T>>(<Dictionary<T>><any>Dictionary);
    // let dict2 = this.cast<Dictionary<T>>(<any>Dictionary);
    // let dict3 = this.cast<Dictionary<any>>(Dictionary);
    // let dict4 = this.cast<Dictionary<T>>(/*<Dictionary<T>>*/<any>this.source.constructor);  //constructor is a type
    // let dict5 = this.cast<Dictionary<T>>(this.dictionary);
    // //Using instances: we can define array only by instance(so use this.array)
    // let arrInstance = this.cast<Array<T>>(this.array);  //cast array to array - useless actually
    private cast<U extends Dictionary<T> | Array<T>>(ctor: U): U{     //Note: generic constraint - <U extends IDictionary<T> | Array<T>>
        if(ctor instanceof Array) {
            //return ObjectHelper.cast<typeof Array, any>(Array, this.source);            //this is wrong, it creates mixin - empty Array(without items) but with properties of object literal

            //const ctor = this.array.length > 0 ? this.array[0].constructor : {};
            //return ObjectHelper.cast<Constructable<T>, any>(<Constructable<T>><any>ctor, this.array);    //this is not right, because it just recreate array

            return <U>this.array;
        }
        //if(ctor instanceof Dictionary){...}       //ctor always Object, so this condition never works
        else
            //if ctor is not instance, if ctor is a type
            return ObjectHelper.cast<typeof Dictionary, any>(Dictionary, this.source);      //produces Dictionary mixin
            //return ObjectHelper.cast<typeof ctor, any>(ctor, this.source);                  //produces Object mixin
    }

    contains(keyIndexCondition: string|number|Condition<T>): boolean{
        if (typeof keyIndexCondition === "number" || typeof keyIndexCondition === "string")
            return (<any>this.source)[keyIndexCondition] !== undefined;
        else if(keyIndexCondition!.predicate)       //TODO: what is '!.'?
            return this.array.some(item => keyIndexCondition.predicate(item));      //may use find() instead of some()
        return false;
    }

    add(keyValuePair: {keyIndex: number|string, value: T}){
        if(!keyValuePair && !keyValuePair.keyIndex)
            throw Error(`Key or index is not provided`);
        let keyIndex = keyValuePair.keyIndex;
        let value = keyValuePair.value;
        const errorMessage = typeof keyIndex === "string" ? `Item with key: ${keyIndex} is already there` : `Item with an index[${keyIndex}] is already there`;
        if(this.contains(keyIndex))
            throw Error(errorMessage);
        (<any>this.source)[keyIndex] = value;
    }

    remove(index:number):void;
    remove(key:string):void;
    remove(condition: Condition<T>): void;
    remove(keyIndexCondition: number|string|Condition<T>){
        if(this.contains(keyIndexCondition)) {
            if (typeof keyIndexCondition === "number" || typeof keyIndexCondition === "string")
                delete (<any>this.source)[keyIndexCondition];           //delete - to remove property from object literal
            else if (keyIndexCondition) {
                //Explanation: won't work when array items is KeyValuePairs because 'index' will have number type even if a source item must be accessed by string key
                // let index = this.getIndex(keyIndexCondition);
                // delete (<any>this.source)[index];
                let item = this.getItem(keyIndexCondition);
                delete (<any>this.source)[keyIndexCondition.selector(item)];
            }
        }
    }

    getIndex(condition: Condition<T>):number{
        if(!this.contains(condition)) return undefined;
        return this.array.indexOf(this.getItem(condition));
    }

    getItem(condition: Condition<T>):T{
        if(!this.contains(condition)) return undefined;
        return this.array.filter(condition.predicate)[0];
    }
}