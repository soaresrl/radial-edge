import { Expansion } from "./predicates";
export declare let resultErrBound: number;
export declare let ccwerrboundA: number;
export declare let ccwerrboundB: number;
export declare let ccwerrboundC: number;
export declare let o3derrboundA: number;
export declare let o3derrboundB: number;
export declare let o3derrboundC: number;
export declare function exactinit(): void;
export declare function Split(a: number): number[];
export declare function TwoProductPresplit(a: number, b: number, bhi: number, blo: number): number[];
/**
 * Produces a non-overlapping expansion x + y such that x + y = a * b
 * x is an approximation of the result of a * b.
 * y represents the roundoff error in the calculation of x.
 * @param a floating point number
 * @param b floating point number
 * @returns [x, y]
 */
export declare function TwoProduct(a: number, b: number): number[];
export declare function TwoOneProduct(a1: number, a0: number, b: number): number[];
/**
 *
 * @param a
 * @param b
 * @param x
 * @returns [x, y]
 */
export declare function TwoDiffTail(a: number, b: number, x: number): number[];
/**
 *
 * @param a
 * @param b
 * @returns
 */
export declare function TwoDiff(a: number, b: number): number[];
/**
 *
 * @param a1
 * @param a0
 * @param b
 * @returns [x2, x1, x0]
 */
export declare function TwoOneDiff(a1: number, a0: number, b: number): number[];
export declare function TwoTwoDiff(a1: number, a0: number, b1: number, b0: number): number[];
export declare function FastTwoSum(a: number, b: number): number[];
export declare function TwoSum(a: number, b: number): number[];
export declare function GrowExpansion(elen: number, e: Expansion, b: number): (number | Float64Array<ArrayBuffer>)[];
export declare function ExpansionSum(e: Expansion, f: Expansion): (number | Float64Array<ArrayBuffer>)[];
