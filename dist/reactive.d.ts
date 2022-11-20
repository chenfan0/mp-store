import type { ObjKey, ObjType, ThisValueType } from "./typing";
export declare const weakMap: WeakMap<ObjType, Map<ObjKey, Set<ThisValueType>>>;
export declare function disableTrack(): void;
export declare function enableTrack(): void;
export declare function setActiveThis(thisValue: ThisValueType): void;
export declare function reactive(value: ObjType): ObjType;
