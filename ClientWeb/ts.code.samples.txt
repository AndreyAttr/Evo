//https://angular.io/docs/ts/latest/guide/template-syntax.html
//IT IS SAID ONLY ABOUT USING IT IN TEMPLATE SYNTAX
//The Angular safe navigation operator (?.) is a more fluent and convenient way to guard
// against nulls in property paths. The expression bails out when it hits the first null
// value. The display is blank, but the app keeps rolling without errors.
//The null hero's name is {{nullHero?.name}}
//It works perfectly with long property paths such as a?.b?.c?.d
//Analogs:
//1) <div *ngIf="nullHero">The null hero's name is {{nullHero.name}}</div>
//2) The null hero's name is {{nullHero && nullHero.name}}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//https://www.typescriptlang.org/docs/handbook/migrating-from-javascript.html
// declare var foo: string[] | null;
// foo.length;  // error - 'foo' is possibly 'null'
// foo!.length; // okay - 'foo!' just has type 'string[]'
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//https://www.typescriptlang.org/docs/handbook/classes.html
//class Greeter
//{
//    static standardGreeting = "Hello, there";
//    greet() { ... }
//}
//let greeterMaker: typeof Greeter = Greeter;         //constructor function - give me the TYPE of Greeter class
//greeterMaker.standardGreeting = "Hey there!";       //working on the TYPE level - change static field of the TYPE itself(not of the instance of this class)

//let greeter2: Greeter = new greeterMaker();         //using 'new' to show that the TYPE will contain not only static members but also constructor too!
//console.log(greeter2.greet());
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//https://www.typescriptlang.org/docs/handbook/advanced-types.html
//keyof T, the index type query operator.
// For any type T, keyof T is the union of known, public property names of T. For example:
//let personProps: keyof Person; // 'name' | 'age' - it's real union type of all Person's properties


//https://www.typescriptlang.org/docs/handbook/generics.html
//https://www.typescriptlang.org/docs/handbook/advanced-types.html
// function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
//     return obj[key];     // o[key] is of type T[K] - so the return type of getProperty() will vary according to which property(with with type) you request
// }
//
// let x = { a: 1, b: 2, c: 3, d: 4 };
//
// getProperty(x, "a"); // okay
// getProperty(x, "m"); // error: Argument of type 'm' isn't assignable to 'a' | 'b' | 'c' | 'd'.



//https://www.typescriptlang.org/docs/handbook/advanced-types.html
//Index types
//With index types, you can get the compiler to check code that uses dynamic property names.
//For example, pattern is to pick a subset of properties from an object:
// function pluck<T, K extends keyof T>(o: T, names: K[]): T[K][] {
//     //K inherited from one of T keys(properties)
//     //We return the array of values of type properties --> T[K][] --> T[K] - it's type property value
//     //T[K], the indexed access operator.
//     return names.map(n => o[n]);
// }
//
// interface Person {
//     name: string;
//     code: number;
//     age: number;
// }
// let person: Person = {
//     name: 'Jarid',
//     code: 56,
//     age: 35
// };
// let strings: (string|number)[] = pluck(person, ['name', "code"]); // ok, string[]



//https://www.typescriptlang.org/docs/handbook/advanced-types.html
//Index types and string index signatures
// interface Mapper<T> {
//     [key: string]: T;    // [key: string] - string index signature - indexation by string key which return value of type T
// }
// let keys: keyof Mapper<number> = 'string'; // string
// let value: Mapper<number>['foo'] = 23; // number
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//https://www.typescriptlang.org/docs/handbook/advanced-types.html
//instanceof
//if (error instanceof Response)
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//https://www.typescriptlang.org/docs/handbook/advanced-types.html
//if (typeof x == "object") { ...
//if (typeof x == "number") { ...
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//https://www.typescriptlang.org/docs/handbook/generics.html
//Using PROTOTYPE PROPERTY to infer and constrain relationships between the constructor function and the instance side of class types
// class Lion extends Animal {
//     keeper: ZooKeeper;
// }
//
// function findKeeper<A extends Animal, K> (a: {new(): A;
//     prototype: {keeper: K}}): K {
//
//     return a.prototype.keeper;
// }
//
// findKeeper(Lion).nametag;  // typechecks!
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//Fabric - need specify parameter of type T has a constructor:
// function create<T>(c: {new(): T; }): T {
//     return new c();
// }
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//declare
//---never type
//spread operator  [...set]          //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set
//Tuple
//using this
//postfix ! remove undefined & null: item!.price
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//https://www.typescriptlang.org/docs/handbook/advanced-types.html
//Just like interfaces, type aliases can also be generic:
    //type Container<T> = { value: T };
//We can also have a type alias refer to itself in a property:
    // type Tree<T> = {
    //     value: T;
    //     left: Tree<T>;
    //     right: Tree<T>;
    // }
//Together with intersection types, we can make some pretty mind-bending types:
    //type LinkedList<T> = T & { next: LinkedList<T> };     //it looks like a one-way linked list
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//https://www.typescriptlang.org/docs/handbook/advanced-types.html
//String literal types allow you to specify the exact value a string must have.
    //type Easing = "ease-in" | "ease-out" | "ease-in-out";
    // class UIElement {
    //     animate(dx: number, dy: number, easing: Easing) {
    //         if (easing === "ease-in") {

    // let button = new UIElement();
    // button.animate(0, 0, "ease-in");
    // button.animate(0, 0, "uneasy"); // error: "uneasy" is not allowed here
//String literal types can be used in the same way to distinguish overloads:
    //function createElement(tagName: "img"): HTMLImageElement;
    //function createElement(tagName: "input"): HTMLInputElement;
    //function createElement(tagName: string): Element {
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//https://www.typescriptlang.org/docs/handbook/basic-types.html
//The never type represents the type of values that never occur. never is the return type for a function expression or an arrow function expression that always throws an exception or one that never returns; Variables also acquire the type never when narrowed by any type guards that can never be true.
    // Function returning never must have unreachable end point
    //function error(message: string): never {
    //    throw new Error(message);
    //}
    //function infiniteLoop(): never {
    //    while (true) {
    //    }
    //}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//https://www.typescriptlang.org/docs/handbook/advanced-types.html
//Polymorphic this types
//A polymorphic this type represents a type that is the subtype of the containing class or interface.
// class BasicCalculator {
//     public constructor(protected value: number = 0) { }
//     public currentValue(): number {
//         return this.value;
//     }
//     public add(operand: number): this {
//         this.value += operand;
//         return this;
//     }
//     public multiply(operand: number): this {
//         this.value *= operand;
//         return this;
//     }
// }
//
// let v1 = new BasicCalculator(2)
//     .multiply(5)
//     .add(1)
//     .currentValue();
//
// class ScientificCalculator extends BasicCalculator {
//     public constructor(value = 0) {
//         super(value);
//     }
//     public sin()/*: this*/ {
//         this.value = Math.sin(this.value);
//         return this;
//     }
// }
//
// let v2 = new ScientificCalculator(2)
//     .multiply(5)    //if we don't use 'this' as a return type of multiply, we will get BasicCalculator here, which doesn't contain 'sin' function. However, with 'this' types, multiply returns 'this', which is ScientificCalculator here.
//     .sin()
//     .add(1)
//     .currentValue();
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// https://www.typescriptlang.org/docs/handbook/advanced-types.html
// Mapped types
// class Person{
//     name: string;
// }
// type ReadonlyMy<T> = {
//     readonly [P in keyof T]: T[P];
//     }
// type PartialMy<T> = {
//     [P in keyof T]?: T[P];
//     }
// type PersonPartial = PartialMy<Person>;
// type ReadonlyPerson = ReadonlyMy<Person>;
// type NullablePerson =  { [P in keyof Person]: Person[P] | null  };   //the same, but not generic - only for one type Person
// type Nullable<T> = { [P in keyof T]: T[P] | null };
// type NullablePerson = Nullable<Person>;                              //generic
// // or we may use all of them - to make our result type properties readonly & optional & nullable:
// type SuperExtendedPerson = Nullable<PartialMy<ReadonlyMy<Person>>>;
//
//
// type Keys = 'option1' | 'option2';
// type Flags = { [K in Keys]: boolean };
// equivalent to
// type Flags = {
//     option1: boolean;
//     option2: boolean;
// }




// type Pick<T, K extends keyof T> = {
//     [P in K]: T[P];
//     }
// type Record<K extends string | number, T> = {
//     [P in K]: T;
//     }
// class Person{
//     name: string;
//     code: number;
//     isEmployee: boolean;
// }
////Pick allows to choose(and then assign to type MyType) only specific properties from type Person:
// type MyType = Pick<Person, 'name' | 'code'>;    //take only 'name' and 'code' from Person
// let picked: MyType =  {                         //using anonimous object to create instance of MyType
//     name: '',
//     code: 1,
//     //isEmployee: false     //error
//};
// let picked2: MyType = new Person();          //using Person constructor to create instance of MyType
// picked2['name'] = '';
// picked2['code'] = 4;
// //picked2['code'] = false;   //error: Type 'false' is not assignable to type 'string | number'.
// //picked2['isEmployee'] = '';       //error
////Record allows to use only specific properties 'name' and 'code' in type ThreeStringProps to return some type T(string | number in our case - you may consider this like a columns in DB row). Each of these properties may return union string | number(so possible mistakes connected with wrong type - see runtime mistakes bellow)
// type ThreeStringProps = Record<'name' | 'code', string | number>
// let record: ThreeStringProps = {
//     name: '',
//     code: 5,
//     //str: ''       //error
// };
// record['name'] = '7';
// record['code'] = 7;
// record['code'] = '7';   //error during runtime
// //record['code'] = false;   //error: Type 'false' is not assignable to type 'string | number'.
// let record2: ThreeStringProps = new Person();
// record2['name'] = '7';
// record2['code'] = 7;
// record2['code'] = '7';   //error during runtime
//record2['code'] = false;   //error: Type 'false' is not assignable to type 'string | number'.
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//https://www.typescriptlang.org/docs/handbook/symbols.html
// let sym2 = Symbol("key");
// let sym3 = Symbol("key");
// sym2 === sym3; // false, symbols are unique
//
//
//
//
// let sym = Symbol("t");
// const getClassNameSymbol = Symbol();
// let indexStr: string = 'index';
//
// let obj = {
//     [sym]: "value",
//     [1 + "abc"]: 'John',
//     [indexStr]: 'Smith',
//     indexStr: 'Property',
//     [getClassNameSymbol]: () => {
//         alert('Computed function');
//         alert(this[sym]);
//     }
// };
//
// alert(obj[sym] + " " + obj[1 + 'abc'] + ' '
//     + obj[indexStr] + ' ' + obj['indexStr']); // "value John Smith Property"
// (<() => void>obj[getClassNameSymbol])();        //need to explicitly cast to fu <() => void> OR (obj[getClassNameSymbol] as () => void)();

// class C {
//     //Computed property names are valid in object literals. They are not supported as class property declarations:
//     //private readonly [sym]:string = 'Computed function';    //error: A computed property name in a class property declaration must directly refer to a built-in symbol.
//     //But, as it said in the error - we can use built-in symbol:
//     [Symbol.hasInstance]: 'Computed function';              //no error
//     //[sym2]: true;       //error: A computed property name in a class property declaration must directly refer to a built-in symbol.
//     [indexStr](a: string):void{};
//     [getClassNameSymbol](){
//         //alert(this[sym]);
//         alert(this[Symbol.hasInstance]);    //undefined. I don't know why?
//         alert(Symbol.hasInstance.toString());        //Symbol(Symbol.hasInstance)
//         alert('Computed function');
//     }
// }
// let c = new C();
// c[getClassNameSymbol]();
// alert(c[Symbol.hasInstance]);        //undefined


//an example of an interface that declares a property with a well-known symbol name:
// interface Iterable<T> {
//     [Symbol.iterator](): Iterator<T>;
// }
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// //https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html
// let pets = new Set(["Cat", "Dog", "Hamster"]);
// pets["species"] = "mammals";
// pets.add("arty");
//
// for (let pet in pets) {
//     console.log(pet); // "species"
// }
//
// //When targeting an ES5 or ES3, iterators are only allowed on values of Array type.
// //It is an error to use for..of loops on non- Array values, even if these non- Array values
// //implement the Symbol.iterator property. But it will work for ES6
// for (let pet of pets) { //error: Type 'Set<string>' is not an array type or a string type
//     console.log(pet); // "Cat", "Dog", "Hamster, "arty""
// }
//
// ////This is already allowed if your target is ES6:
// interface MyMap<T> {
//     values(): Iterable<T>;
// }
// var myMap: MyMap<string>;
// for (let value of myMap.values()) { //error if you targeting ES3 or ES5: Type 'Iterable<string>' is not an array type or a string type
//     var s: string = value;
// }
//
// //// Use the spread operator to transform a set into an Array(still doesn't work with ES3/5):
// for (let pet of [...pets]) {//error: Type 'Set<string>' is not an array type
//     console.log(pet); // Set [ "Cat", "Dog", "Hamster", "arty" ]
// }
//
// //create array wrapper for pets(using 2 pets to show better that it's array declaration)
// for (let pet of [pets, pets]) {
//     console.log(pet); // Set [ "Cat", "Dog", "Hamster", "arty" ], Set [ "Cat", "Dog", "Hamster", "arty" ]
// }
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// //https://www.typescriptlang.org/docs/handbook/modules.html
// let validators: { [s: string]: StringValidator; } = {};     //anonimous index type
// validators["ZIP code"] = new ZipCodeValidator();
// validators["Letters only"] = new LettersOnlyValidator();


// //Optional Module Loading:
// declare function require(moduleName: string): any;
// import { ZipCodeValidator as Zip } from "./ZipCodeValidator";
// const needZipValidation: boolean = false;
// if (needZipValidation) {
//     let ZipCodeValidator: typeof Zip = require("./ZipCodeValidator");   //we do not create an instance of type Zip, we just use 'require' to do optional loading. We use 'typeof' in type position to produce type of the value(the module)
//     let validator = new ZipCodeValidator();
//     if (validator.isAcceptable("...")) { /* ... */ }
// }

////Shorthand ambient modules
////If you don’t want to take the time to write out declarations before using a new module, you can use a shorthand declaration to get started quickly.
// declare module "hot-new-module";
// //All imports from a shorthand module will have the any type.
// import x, {y} from "hot-new-module";
// x(y);



//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------