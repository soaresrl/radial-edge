// import path = require("path");
import { ccwerrboundA, ccwerrboundB, ccwerrboundC, FastTwoSum, resultErrBound, TwoDiffTail, TwoProduct, TwoSum, TwoTwoDiff } from "./macros";
// import { readFileSync } from 'fs';
// import assert = require("assert");
// import * as assert from "assert";

export type Real = number;
export type Expansion = Float64Array;

export function estimate(e: Float64Array) {
    let Q: number;

    Q = e[0];

    for (let eindex = 1; eindex < e.length; eindex++) {
        Q += e[eindex];        
    }

    return Q;
}

export function fast_expansion_sum_zeroelim(elen: number, e: Float64Array, flen: number, f: Float64Array, h: Float64Array): number {
    let Q: Real;
    let Qnew: Real;
    let hh: Real;
    
    let enow: Real, fnow: Real;

    enow = e[0];
    fnow = f[0];

    let eindex = 0;
    let findex = 0;
    let hindex = 0;

    if ((fnow > enow) == (fnow > -enow)) {
        Q = enow;
        enow = e[++eindex];
    }
    else {
        Q = fnow;
        fnow = f[++findex];
    }
    
    hindex = 0;

    if ((eindex < elen) && (findex < flen)) {
        if((fnow > enow) == (fnow > -enow)) {
            [Qnew, hh] = FastTwoSum(enow, Q);
            enow = e[++eindex];
        } else {
            [Qnew, hh] = FastTwoSum(fnow, Q);
            fnow = f[++findex];
        }
        Q = Qnew;
        if (hh != 0.0) {
            h[hindex++] = hh;
        }

        while((eindex < elen) && (findex < flen)) {
            if ((fnow > enow) == (fnow > -enow)) {
                [Qnew, hh] = FastTwoSum(enow, Q);
                enow = e[++eindex];
            } else {
                [Qnew, hh] = FastTwoSum(fnow, Q);
                fnow = f[++findex];
            }
            Q = Qnew;
            if (hh != 0.0) {
                h[hindex++] = hh;
            }
        }
    }
    while(eindex < elen) {
        [Qnew, hh] = TwoSum(enow, Q);
     
        enow = e[++eindex];
        Q = Qnew;
     
        if (hh != 0.0) {
            h[hindex++] = hh;
        }
    }
    while(findex < flen) {
        [Qnew, hh] = TwoSum(fnow, Q);
     
        fnow = f[++findex];
        Q = Qnew;
     
        if (hh != 0.0) {
            h[hindex++] = hh;
        }
    }
    if ((Q != 0.0) || (hindex == 0)) {
        h[hindex++] = Q;
    }

    return hindex;
}

export function linear_expansion_sum(elen: number, e: Float64Array, flen: number, f: Float64Array, h: Float64Array): number {
    let Q: Real, q: Real, Qnew: Real, R: Real, bvirt: Real;

    let avirt: Real, bround: Real, around: Real;
    
    let eindex: number, findex: number, hindex: number;

    let enow: Real, fnow: Real;

    let g0: Real;

    enow = e[0];
    fnow = f[0];

    eindex = findex = 0;

    if ((fnow > enow) == (fnow > -enow)) {
        g0 = enow;
        enow = e[++eindex];
    } else {
        g0 = fnow;
        fnow = f[++findex];
    }

    if ((eindex < elen) && ((findex >= flen) || ((fnow > enow) == (fnow > -enow)))) {
        
    }

    return 0;
}

export function Orient2DAdapt(ax: number, ay: number, bx: number, by: number, cx: number, cy: number, detsum: number) {
    let C1: Float64Array = new Float64Array(8);
    let C2: Float64Array = new Float64Array(12);
    let D: Float64Array = new Float64Array(16);

    let acx = (ax - cx);
    let bcx = (bx - cx);
    let acy = (ay - cy);
    let bcy = (by - cy);

    let [detleft, detlefttail] = TwoProduct(acx, bcy);
    let [detright, detrighttail] = TwoProduct(acy, bcx);

    let B = new Float64Array(4);
    let u = new Float64Array(4);

    let [a, b, c, d] = TwoTwoDiff(detleft, detlefttail, detright, detrighttail);

    B[3] = a
    B[2] = b;
    B[1] = c;
    B[0] = d;

    let det = estimate(B);

    let errbound = ccwerrboundB * detsum;

    if ((det >= errbound) || (-det >= errbound)) {
        return det;
    }

    let [, acxtail] = TwoDiffTail(ax, cx, acx);
    let [, bcxtail] = TwoDiffTail(bx, cx, bcx);
    let [, acytail] = TwoDiffTail(ay, cy, acy);
    let [, bcytail] = TwoDiffTail(by, cy, bcy);

    if((acxtail == 0.0) && (acytail == 0.0) && (bcxtail == 0.0) && (bcytail == 0.0)){
        return det;
    }

    errbound = ccwerrboundC * detsum + resultErrBound * Math.abs(det);

    det += (acx * bcytail + bcy * acxtail) - (acy * bcxtail + bcx * acytail);

    if ((det >= errbound) || (-det >= errbound)) {
        return det;
    }

    let [s1, s0] = TwoProduct(acxtail, bcy);
    let [t1, t0] = TwoProduct(acytail, bcx);

    let [u3, u2, u1, u0] = TwoTwoDiff(s1, s0, t1, t0);

    u[3] = u3;
    u[2] = u2;
    u[1] = u1;
    u[0] = u0;

    let C1length = fast_expansion_sum_zeroelim(4, B, 4, u, C1);

    [s1, s0] = TwoProduct(acx, bcytail);
    [t1, t0] = TwoProduct(acy, bcxtail);

    [u[3], u[2], u[1], u[0]] = TwoTwoDiff(s1, s0, t1, t0);

    let C2lenght = fast_expansion_sum_zeroelim(C1length, C1, 4, u, C2);

    [s1, s0] = TwoProduct(acxtail, bcytail);
    [t1, t0] = TwoProduct(acytail, bcxtail);
    [u[3], u[2], u[1], u[0]] = TwoTwoDiff(s1, s0, t1, t0);

    let Dlenght = fast_expansion_sum_zeroelim(C2lenght, C2, 4, u, D);

    return D[Dlenght-1];
}

export function Orient2D(ax: number, ay: number, bx: number, by: number, cx: number, cy: number) {
    const detleft = (ax - cx) * (by - cy);
    const detright = (ay - cy) * (bx - cx);
    const det = detleft - detright;

    let detsum: number;
    
    if (detleft > 0.0) {
        if (detright <= 0.0) {
            return det;
        } else {
            detsum = detleft + detright;
        }
    } else if (detleft < 0.0) {
        if (detright >= 0.0) {
            return det;
        } else { 
            detsum = -detleft - detright;
        }
    } else {
        return det;
    }

   let errbound = ccwerrboundA * detsum;

   if ((det >= errbound) || (-det >= errbound)) {
    return det;
   }

   return Orient2DAdapt(ax, ay, bx, by, cx, cy, detsum);
}
