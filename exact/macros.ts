import { Expansion } from "./predicates";

let splitter: number;
let epsilon: number;

export let resultErrBound: number;
export let ccwerrboundA: number;
export let ccwerrboundB: number;
export let ccwerrboundC: number;
export let o3derrboundA: number;
export let o3derrboundB: number;
export let o3derrboundC: number;

export function exactinit() {
    let half: number = 0.5;
    let check: number = 1.0;
    let lastcheck: number;
    let everyother: boolean = true;

    epsilon = 1.0;
    splitter = 1.0;

    do {
        lastcheck = check;
        epsilon *= half;

        if (everyother) {
            splitter *= 2.0;
        }
        
        everyother = !everyother;
        check = 1.0 + epsilon;
    } while ((check != 1.0) && (check != lastcheck));
    splitter += 1.0;

    resultErrBound = (3.0 + 8.0 * epsilon) * epsilon;
    ccwerrboundA = (3.0 + 16.0 * epsilon) * epsilon;
    ccwerrboundB = (2.0 + 12.0 * epsilon) * epsilon;
    ccwerrboundC = (9.0 + 64.0 * epsilon) * epsilon * epsilon;

    o3derrboundA = (7.0 + 56.0 * epsilon) * epsilon;
    o3derrboundB = (3.0 + 28.0 * epsilon) * epsilon;
    o3derrboundC = (26.0 + 288.0 * epsilon) * epsilon * epsilon;
}

export function Split(a: number) {
    let c = splitter * a;

    let abig = c - a;
    
    let ahi = c - abig;
    let alo = a - ahi;

    return [ahi, alo];
}

export function TwoProductPresplit(a: number, b: number, bhi: number, blo: number){ 
    let x = a * b;
    let [ahi, alo] = Split(a)

    let err1 = x - (ahi * bhi);
    let err2 = err1 - (alo * bhi);
    let err3 = err2 - (ahi * blo);

    let y = (alo * blo) - err3;

    return [x, y];
}

/**
 * Produces a non-overlapping expansion x + y such that x + y = a * b
 * x is an approximation of the result of a * b.
 * y represents the roundoff error in the calculation of x.
 * @param a floating point number
 * @param b floating point number
 * @returns [x, y]
 */
export function TwoProduct(a: number, b: number) {
    let x = a * b;

    let [ahi, alo] = Split(a);
    let [bhi, blo] = Split(b);

    let err1 = x - (ahi * bhi);
    let err2 = err1 - (alo * bhi);
    let err3 = err2 - (ahi * blo);

    let y = (alo * blo) - err3;

    return [x, y]
}

export function TwoOneProduct(a1: number, a0: number, b: number) {
    let [bhi, blo] = Split(b);
    let [_i, x0] = TwoProductPresplit(a0, b, bhi, blo);
    let [_j, _0] = TwoProductPresplit(a1, b, bhi, blo);
    let [_k, x1] = TwoSum(_i, _0);

    let [x3, x2] = FastTwoSum(_j, _k);


    return [x3, x2, x1, x0];
}

/**
 * 
 * @param a 
 * @param b 
 * @param x 
 * @returns [x, y]
 */
export function TwoDiffTail(a: number, b: number, x: number) {
    let bvirt = a - x;
    let avirt = x + bvirt;
    let bround = bvirt - b;
    let around = a - avirt;

    let y = around + bround;

    return [x, y];
}

/**
 * 
 * @param a 
 * @param b 
 * @returns 
 */
export function TwoDiff(a: number, b: number) {
    let x = a - b;

    let bvirt = a - x;
    let avirt = x + bvirt;
    let bround = bvirt - b;
    let around = a - avirt;

    let y = around + bround;
    
    return [x, y];
}

/**
 * 
 * @param a1 
 * @param a0 
 * @param b 
 * @returns [x2, x1, x0]
 */
export function TwoOneDiff(a1: number, a0: number , b: number) {
    let [_i, x0] = TwoDiff(a0, b);
    let [x2, x1] = TwoSum(a1, _i);

    return [x2, x1, x0];
}

export function TwoTwoDiff(a1: number, a0: number, b1: number, b0: number){
    let [_j, _0, x0] = TwoOneDiff(a1, a0, b0);
    let [x3, x2, x1] = TwoOneDiff(_j, _0, b1);

    return [x3, x2, x1, x0];
}

export function FastTwoSum(a: number, b: number) {
    let x = a + b;
    let bvirt = x - a;

    let y = b - bvirt;

    return [x, y];
}

export function TwoSum(a: number, b: number) {
    let x = a + b;
    let bvirt = x - a;
    let avirt = x - bvirt;
    let bround = b - bvirt;
    let around = a - avirt;
    let y = around + bround;

    return [x, y];
}

export function GrowExpansion(elen: number, e: Expansion, b: number) {
    let Q: number;
    let Qnew: number;
    let eindex: number;
    let enow: number;

    Q = b;

    let h = new Float64Array(elen + 1);

    for (let eindex = 0; eindex < elen; eindex++) {
        enow = e[eindex];
        let [Qi, hi] = TwoSum(Q, enow);

        Qnew = Qi;
        Q = Qnew;
        h[eindex] = hi;
    }

    h[eindex] = Q;

    return [h, eindex + 1];
}

export function ExpansionSum(e: Expansion, f: Expansion) {
    let Q: number;
    let Qnew: number;

    let findex: number, hindex:number, hlast: number;

    let hnow: number;

    Q = f[0];

    let h = new Float64Array(e.length + f.length);

    for (hindex = 0; hindex < e.length; hindex++) {
        hnow = e[hindex];
        let [a, b] = TwoSum(Q, hnow);

        Qnew = a;
        Q = Qnew;
        h[hindex] = b;
    }
    h[hindex] = Q;

    hlast = hindex;
    for (findex = 1; findex < f.length; findex++) {
        Q = f[findex];
        for (hindex = 0; hindex < hlast; hindex++) {
            hnow = h[hindex]
            
            let [a, b] = TwoSum(Q, hnow);

            Qnew = a;
            h[hindex] = b;

            Q = Qnew;
        }    
        h[++hlast] = Q    
    }

    return [h, hlast+1];
}

exactinit();