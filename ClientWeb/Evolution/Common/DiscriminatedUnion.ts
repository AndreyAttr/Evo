// Discriminated Unions(tagged unions, algebraic data types)
// Combination of string literal types, union types, type guards and type aliases

export enum Enum1{id, name, description};
export enum Enum2{age, address};
export enum Enum3{prefferences, options};
//Non hierarchical(without inheritance) - discriminated interfaces:
export interface DiscriminatedEnum1{
    kind: "enum1",      //discriminant property
    value: Enum1
}
export interface DiscriminatedEnum2{
    kind: "enum2",
    value: Enum2
}
export interface DiscriminatedEnum3{
    kind: "enum3",
    value: Enum3
}
export type Enums = Enum1 | Enum2 | Enum3;
export type DiscriminatedEnums = DiscriminatedEnum1 | DiscriminatedEnum2 | DiscriminatedEnum3;     //union & aliasing

/*
 https://www.typescriptlang.org/docs/handbook/advanced-types.html - Exhaustiveness checking
* Here, assertNever checks that s is of type never — the type that’s left after all other cases have been removed.
* If you forget a case, then s will have a real type and you will get a type error.
* This method requires you to define an extra function, but it’s much more obvious when you forget it.
* */
function assertNever(enums: never):never{
    throw new Error(`Unexisted enum type: ${enums}`);
}

export function getEnumValue(enums: DiscriminatedEnums): Enums{
    switch (enums.kind){
        case "enum1": return enums.value;
        case "enum2": return enums.value;
        case "enum3": return enums.value;
        default: return assertNever(enums);
    }
}