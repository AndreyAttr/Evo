//Workaround: all this interface - it's just attempt to store workaround in one place

export interface ManuallyCast<T>{
    manuallyCastTo(source: any): T | T[];
}