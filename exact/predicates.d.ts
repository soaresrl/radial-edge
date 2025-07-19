export type Real = number;
export type Expansion = Float64Array;
export declare function estimate(e: Float64Array): number;
export declare function fast_expansion_sum_zeroelim(elen: number, e: Float64Array, flen: number, f: Float64Array, h: Float64Array): number;
export declare function linear_expansion_sum(elen: number, e: Float64Array, flen: number, f: Float64Array, h: Float64Array): number;
export declare function ScaleExpansionZeroElim(elen: number, e: Float64Array, b: number, h: Float64Array): [number, Float64Array];
export declare function Orient2DAdapt(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, detsum: number): number;
export declare function Orient2D(ax: number, ay: number, bx: number, by: number, cx: number, cy: number): number;
export declare function Orient3D(ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number, dx: number, dy: number, dz: number): number;
