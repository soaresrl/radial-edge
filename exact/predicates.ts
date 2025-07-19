// import path = require("path");
import { ccwerrboundA, ccwerrboundB, ccwerrboundC, FastTwoSum, o3derrboundA, o3derrboundB, o3derrboundC, resultErrBound, Split, TwoDiffTail, TwoOneProduct, TwoProduct, TwoProductPresplit, TwoSum, TwoTwoDiff } from "./macros";
import { readFileSync } from 'fs';
// import assert = require("assert");
import * as assert from "assert";

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

export function ScaleExpansionZeroElim(elen: number, e: Float64Array, b: number, h: Float64Array): [number, Float64Array] {
    let sum: number;
    let eindex: number, hindex: number;
    let enow: number;

    let [bhi, blo] = Split(b);

    let [Q, hh] = TwoProductPresplit(e[0], b, bhi, blo);

    hindex = 0;

    if (hh != 0.0) {
        h[hindex++] = hh;
    }
    for (eindex = 1; eindex < elen; eindex++) {
        enow = e[eindex];
        let [product1, product0] = TwoProductPresplit(enow, b, bhi, blo);
        [sum, hh] = TwoSum(Q, product1)

        if (hh != 0.0) {
            h[hindex++] = hh;
        }

        [Q, hh] = TwoSum(product1, sum);
        if (hh != 0.0) {
            h[hindex++] = hh;
        }
    }

    if ((Q != 0.0) || (hindex == 0)) {
        h[hindex++] = Q;
    }

    return [hindex, h];
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

export function Orient3D(ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number, dx: number, dy: number, dz: number) {
    let adx = (ax - dx);
    let bdx = (bx - dx);
    let cdx = (cx - dx);
    let ady = (ay - dy);
    let bdy = (by - dy);
    let cdy = (cy - dy);
    let adz = (az - dz);
    let bdz = (bz - dz);
    let cdz = (cz - dz);

    let bdxcdy = bdx * cdy;
    let cdxbdy = cdx * bdy;

    let cdxady = cdx * ady;
    let adxcdy = adx * cdy;

    let adxbdy = adx * bdy;
    let bdxady = bdx * ady;

    let det = adz * (bdxcdy - cdxbdy) + bdz * (cdxady - adxcdy) + cdz * (adxbdy - bdxady);

    let permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * adz + 
        (Math.abs(cdxady) + Math.abs(adxcdy)) * bdz +
        (Math.abs(adxbdy) + Math.abs(bdxady)) * cdz;

    let errbound = o3derrboundA * permanent;
    if ((det > errbound) || (-det > errbound)) {
        return det;
    }

    return Orient3DAdapt(ax, ay, az, bx, by, bz, cx, cy, cz, dx, dy, dz, permanent);
}

function Orient3DAdapt(ax: number, ay: number, az: number, bx: number, by: number, bz: number, cx: number, cy: number, cz: number, dx: number, dy: number, dz: number, permanent: number) {
    let det: number;
    let errbound: number;
    let alen: number;
    let blen: number;
    let clen: number;
    let ablen: number;

    let bc = new Float64Array(4);
    let ca = new Float64Array(4);
    let ab = new Float64Array(4);

    let adet = new Float64Array(8);
    let bdet = new Float64Array(8);
    let cdet = new Float64Array(8);
    let abdet = new Float64Array(8);
    let fin1 = new Float64Array(192);
    let fin2 = new Float64Array(192);

    let abt = new Float64Array(8);
    let bct = new Float64Array(8);
    let cat = new Float64Array(8);

    let at_b = new Float64Array(4);
    let at_c = new Float64Array(4);
    let bt_c = new Float64Array(4);
    let bt_a = new Float64Array(4);
    let ct_a = new Float64Array(4);
    let ct_b = new Float64Array(4);

    let u = new Float64Array(4);
    let v = new Float64Array(12);
    let w = new Float64Array(16);

    let at_blen: number;
    let at_clen: number;
    let bt_clen: number;
    let bt_alen: number;
    let ct_alen: number;
    let ct_blen: number;

    let adxtail: number;
    let bdxtail: number;
    let cdxtail: number;
    let adytail: number;
    let bdytail: number;
    let cdytail: number;
    let adztail: number;
    let bdztail: number;
    let cdztail: number;

    let vlength: number;

    let adyt_cdx0: number;
    let adyt_cdx1: number;

    let adyt_bdx0: number;
    let adyt_bdx1: number;
    let adxt_bdy0: number;
    let adxt_bdy1: number;

    let bdxt_cdy0: number;
    let bdxt_cdy1: number;
    let bdyt_cdx0: number;
    let bdyt_cdx1: number;

    let bdyt_adx0: number;
    let bdyt_adx1: number;
    let bdxt_ady0: number;
    let bdxt_ady1: number;

    let cdxt_ady0: number;
    let cdxt_ady1: number;
    let cdyt_adx0: number;
    let cdyt_adx1: number;

    let cdyt_bdx0: number;
    let cdyt_bdx1: number;
    let cdxt_bdy0: number;
    let cdxt_bdy1: number;

    let adxt_cdy0: number;
    let adxt_cdy1: number;

    let adxt_bdyt1: number;
    let bdxt_adyt1: number;

    let bdxt_cdyt0: number;
    let bdxt_cdyt1: number;

    let cdxt_bdyt1: number;
    let cdxt_adyt1: number;

    let cdxt_bdyt0: number;
    let cdxt_adyt0: number;

    
    let adxt_cdyt0: number;
    let adxt_cdyt1: number;
    let adxt_bdyt0: number;
    let bdxt_adyt0: number;

    let adx = (ax - dx);
    let bdx = (bx - dx);
    let cdx = (cx - dx);
    let ady = (ay - dy);
    let bdy = (by - dy);
    let cdy = (cy - dy);
    let adz = (az - dz);
    let bdz = (bz - dz);
    let cdz = (cz - dz);

    let [bdxcdy1, bdxcdy0] = TwoProduct(bdx, cdy);
    let [cdxbdy1, cdxbdy0] = TwoProduct(cdx, bdy);

    let [bc3, bc2, bc1, bc0] = TwoTwoDiff(bdxcdy1, bdxcdy0, cdxbdy0, cdxbdy0);

    bc[3] = bc3;
    bc[2] = bc2;
    bc[1] = bc1;
    bc[0] = bc0;

    [alen, adet] = ScaleExpansionZeroElim(4, bc, adz, adet);

    let [cdxady1, cdxady0] = TwoProduct(cdx, ady);
    let [adxcdy1, adxcdy0] = TwoProduct(adx, cdy);
    let [ca3, ca2, ca1, ca0] = TwoTwoDiff(cdxady1, cdxady0, adxcdy1, adxcdy0);

    ca[3] = ca3;
    ca[2] = ca2;
    ca[1] = ca1;
    ca[0] = ca0;

    [blen, bdet] = ScaleExpansionZeroElim(4, ca, bdz, bdet);

    let [adxbdy1, adxbdy0] = TwoProduct(adx, bdy);
    let [bdxady1, bdxady0] = TwoProduct(bdx, ady);
    let [ab3, ab2, ab1, ab0] = TwoTwoDiff(adxbdy1, adxbdy0, bdxady1, bdxady0);

    ab[3] = ab3;
    ab[2] = ab2;
    ab[1] = ab1;
    ab[0] = ab0;

    [clen, cdet] = ScaleExpansionZeroElim(4, ab, cdz, cdet);

    ablen = fast_expansion_sum_zeroelim(alen, adet, blen, bdet, abdet);
    let finlength = fast_expansion_sum_zeroelim(ablen, abdet, clen, cdet, fin1);

    det = estimate(fin1);

    errbound = o3derrboundB * permanent;

    if ((det > errbound) || (-det > errbound)) {
        return det;
    }

    [adx, adxtail] = TwoDiffTail(ax, dx, adx);
    [bdx, bdxtail] = TwoDiffTail(bx, dx, bdx);
    [cdx, cdxtail] = TwoDiffTail(cx, dx, cdx);
    [ady, adytail] = TwoDiffTail(ay, dy, ady);
    [bdy, bdytail] = TwoDiffTail(by, dy, bdy);
    [cdy, cdytail] = TwoDiffTail(cy, dy, cdy);
    [adz, adztail] = TwoDiffTail(az, dz, adz);
    [bdz, bdztail] = TwoDiffTail(bz, dz, bdz);
    [cdz, cdztail] = TwoDiffTail(cz, dz, cdz);

    if ((adxtail == 0.0) && (bdxtail == 0.0) && (cdxtail == 0.0) &&
        (adytail == 0.0) && (bdytail == 0.0) && (cdytail == 0.0) &&
        (adztail == 0.0) && (bdztail == 0.0) && (cdztail == 0.0)) {
        return det;
    }

    errbound = o3derrboundC * permanent + resultErrBound * Math.abs(det);

    det += (adz * ((bdx * cdytail + cdy * bdxtail) - (bdy * cdxtail + cdx * bdytail)) + adztail * (bdx * cdy - bdy * cdx))
        + (bdz * ((cdx * adytail + ady * cdxtail) - (cdy * adxtail + adx * cdytail)) + bdztail * (cdx * ady - cdy * adx))
        + (cdz * ((adx * bdytail + bdy * adxtail) - (ady * bdxtail + bdx * adytail)) + cdztail * (adx * bdy - ady * bdx));

    if ((det > errbound) || (-det > errbound)) {
        return det;
    }

    let finnow = fin1;
    let finother = fin2;

    if (adxtail == 0.0) {
        if (adytail == 0.0) {
            at_b[0] = 0.0;
            at_blen = 1;
            at_c[0] = 0.0;
            at_clen = 1;
        } else {
            let [at_blarge, at_b0] = TwoProduct(-adytail, bdx);
            at_b[1] = at_blarge;;
            at_b[0] = at_b0;
            at_blen = 2;
            let [at_clarge, at_c0] = TwoProduct(-adytail, cdx);
            at_c[1] = at_clarge;
            at_c[0] = at_c0;
            at_clen = 2;
        }
    } else {
        if (adytail == 0.0) {
            let [at_blarge, at_b0] = TwoProduct(adxtail, bdy);
            at_b[1] = at_blarge;
            at_b[0] = at_b0;
            at_blen = 2;
            let [at_clarge, at_c0] = TwoProduct(-adxtail, cdy);
            at_c[1] = at_clarge;
            at_c[0] = at_c0;
            at_clen = 2;
        } else {
            [adxt_bdy1, adxt_bdy0] = TwoProduct(adxtail, bdy);
            [adyt_bdx1, adyt_bdx0] = TwoProduct(adytail, bdx);

            let [at_blarge, at_b2, at_b1, at_b0] = TwoTwoDiff(adxt_bdy1, adxt_bdy0, adyt_bdx1, adyt_bdx0);

            at_b[3] = at_blarge;
            at_b[2] = at_b2;
            at_b[1] = at_b1;
            at_b[0] = at_b0;
            at_blen = 4;

            [adyt_cdx1, adyt_cdx0] = TwoProduct(adytail, cdx);
            [adxt_cdy1, adxt_cdy0] = TwoProduct(adxtail, cdy);

            let [at_clarge, at_c2, at_c1, at_c0] = TwoTwoDiff(adyt_cdx1, adyt_cdx0, adxt_cdy1, adxt_cdy0);
            at_c[3] = at_clarge;
            at_c[2] = at_c2;
            at_c[1] = at_c1;
            at_c[0] = at_c0;
            at_clen = 4;
        }
    }
    
    if (bdxtail == 0.0) {
        if (bdytail == 0.0) {
            bt_c[0] = 0.0;
            bt_clen = 1;
            bt_a[0] = 0.0;
            bt_alen = 1;
        } else {
            let [bt_clarge, bt_c0] = TwoProduct(-bdytail, cdx);
            bt_c[1] = bt_clarge;
            bt_c[0] = bt_c0;
            bt_clen = 2;
            let [bt_alarge, bt_a0] = TwoProduct(bdytail, adx);
            bt_a[1] = bt_alarge;
            bt_a[0] = bt_a0;
            bt_alen = 2;
        }
    } else {
        if (bdytail == 0.0) {
            let [bt_clarge, bt_c0] = TwoProduct(bdxtail, cdy);
            bt_c[1] = bt_clarge;
            bt_c[0] = bt_c0;
            bt_clen = 2;
            let [bt_alarge, bt_a0] = TwoProduct(-bdxtail, ady);
            bt_a[1] = bt_alarge;
            bt_a[0] = bt_a0;
            bt_alen = 2;
        } else {
            [bdxt_cdy1, bdxt_cdy0] = TwoProduct(bdxtail, cdy);
            [bdyt_cdx1, bdyt_cdx0] = TwoProduct(bdytail, cdx);

            let [bt_clarge, bt_c2, bt_c1, bt_c0] = TwoTwoDiff(bdxt_cdy1, bdxt_cdy0, bdyt_cdx1, bdyt_cdx0);

            bt_c[3] = bt_clarge;
            bt_c[2] = bt_c2;
            bt_c[1] = bt_c1;
            bt_c[0] = bt_c0;
            bt_clen = 4;

            [bdyt_adx1, bdyt_adx0] = TwoProduct(bdytail, adx);
            [bdxt_ady1, bdxt_ady0] = TwoProduct(bdxtail, ady);

            let [bt_alarge, bt_a2, bt_a1, bt_a0] = TwoTwoDiff(bdyt_adx1, bdyt_adx0, bdxt_ady1, bdxt_ady0);
            bt_a[3] = bt_alarge;
            bt_a[2] = bt_a2;
            bt_a[1] = bt_a1;
            bt_a[0] = bt_a0;
            bt_alen = 4;
        }
    }

    if (cdxtail == 0.0) {
        if (cdytail == 0.0) {
            ct_a[0] = 0.0;
            ct_alen = 1;
            ct_b[0] = 0.0;
            ct_blen = 1;
        } else {
            let [ct_alarge, ct_a0] = TwoProduct(-cdytail, adx);
            ct_a[1] = ct_alarge;
            ct_a[0] = ct_a0;
            ct_alen = 2;
            let [ct_blarge, ct_b0] = TwoProduct(cdytail, bdx);
            ct_b[1] = ct_blarge;
            ct_b[0] = ct_b0;
            ct_blen = 2;
        }
    } else {
        if (cdytail == 0.0) {
            let [ct_alarge, ct_a0] = TwoProduct(cdxtail, ady);
            ct_a[1] = ct_alarge;
            ct_a[0] = ct_a0;
            ct_alen = 2;
            let [ct_blarge, ct_b0] = TwoProduct(-cdxtail, bdy);
            ct_b[1] = ct_blarge;
            ct_b[0] = ct_b0;
            ct_blen = 2;
        } else {
            [cdxt_ady1, cdxt_ady0] = TwoProduct(cdxtail, ady);
            [cdyt_adx1, cdyt_adx0] = TwoProduct(cdytail, adx);

            let [ct_alarge, ct_a2, ct_a1, ct_a0] = TwoTwoDiff(cdxt_ady1, cdxt_ady0, cdyt_adx1, cdyt_adx0);

            ct_a[3] = ct_alarge;
            ct_a[2] = ct_a2;
            ct_a[1] = ct_a1;
            ct_a[0] = ct_a0;
            ct_alen = 4;

            [cdyt_bdx1, cdyt_bdx0] = TwoProduct(cdytail, bdx);
            [cdxt_bdy1, cdxt_bdy0] = TwoProduct(cdxtail, bdy);

            let [ct_blarge, ct_b2, ct_b1, ct_b0] = TwoTwoDiff(cdyt_bdx1, cdyt_bdx0, cdxt_bdy1, cdxt_bdy0);

            ct_b[3] = ct_blarge;
            ct_b[2] = ct_b2;
            ct_b[1] = ct_b1;
            ct_b[0] = ct_b0;
            ct_blen = 4;
        }
    }

    let bctlen = fast_expansion_sum_zeroelim(bt_clen, bt_c, ct_blen, ct_b, bct);

    let [wlength] = ScaleExpansionZeroElim(bctlen, bct, adz, w);

    finlength = fast_expansion_sum_zeroelim(finlength, finnow, wlength, w, finother);

    let finswap = finnow;
    finnow = finother;
    finother = finswap;

    let catlen = fast_expansion_sum_zeroelim(ct_alen, ct_a, at_clen, at_c, cat);
    
    [wlength] = ScaleExpansionZeroElim(catlen, cat, bdz, w);
    
    finlength = fast_expansion_sum_zeroelim(finlength, finnow, wlength, w, finother);
    finswap = finnow;
    finnow = finother;
    finother = finswap;
    
    let abtlen = fast_expansion_sum_zeroelim(at_blen, at_b, bt_alen, bt_a, abt);

    [wlength] = ScaleExpansionZeroElim(abtlen, abt, cdz, w);

    finlength = fast_expansion_sum_zeroelim(finlength, finnow, wlength, w, finother);

    finswap = finnow;
    finnow = finother;
    finother = finswap;

    if (adztail != 0.0) {
        [vlength] = ScaleExpansionZeroElim(4, bc, adztail, v);

        finlength = fast_expansion_sum_zeroelim(finlength, finnow, vlength, v, finother);

        finswap = finnow;
        finnow = finother;
        finother = finswap;
    }

    if (bdztail != 0.0) {
        [vlength] = ScaleExpansionZeroElim(4, ca, bdztail, v);
        finlength = fast_expansion_sum_zeroelim(finlength, finnow, vlength, v, finother);

        finswap = finnow;
        finnow = finother;
        finother = finswap;
    }

    if (cdztail != 0.0) {
        [vlength] = ScaleExpansionZeroElim(4, ab, cdztail, v);
        finlength = fast_expansion_sum_zeroelim(finlength, finnow, vlength, v, finother);

        finswap = finnow;
        finnow = finother;
        finother = finswap;
    }

    if (adxtail != 0.0) {
        if (bdytail != 0.0) {
            [adxt_bdyt1, adxt_bdyt0] = TwoProduct(adxtail, bdytail);
            let [u3, u2, u1, u0] = TwoOneProduct(adxt_bdyt1, adxt_bdyt0, cdz);
            u[3] = u3;
            u[2] = u2;
            u[1] = u1;
            u[0] = u0;

            finlength = fast_expansion_sum_zeroelim(finlength, finnow, 4, u, finother);
            finswap = finnow;
            finnow = finother;
            finother = finswap;

            if (cdztail != 0.0) {
                [u3, u2, u1, u0] = TwoOneProduct(adxt_bdyt1, adxt_bdyt0, cdztail);

                u[3] = u3;
                u[2] = u2;
                u[1] = u1;
                u[0] = u0;
                finlength = fast_expansion_sum_zeroelim(finlength, finnow, 4, u, finother);
                finswap = finnow;
                finnow = finother;
                finother = finswap;
            }
        }

        if(cdytail != 0.0) {
            [adxt_cdyt1, adxt_cdyt0] = TwoProduct(-adxtail, cdytail);
            let [u3, u2, u1, u0] = TwoOneProduct(adxt_cdyt1, adxt_cdyt0, bdz);

            u[3] = u3;
            u[2] = u2;
            u[1] = u1;
            u[0] = u0;

            finlength = fast_expansion_sum_zeroelim(finlength, finnow, 4, u, finother);
            finswap = finnow;
            finnow = finother;
            finother = finswap;

            if (bdztail != 0.0) {
                [u3, u2, u1, u0] = TwoOneProduct(adxt_cdyt1, adxt_cdyt0, bdztail);

                u[3] = u3;
                u[2] = u2;
                u[1] = u1;
                u[0] = u0;

                finlength = fast_expansion_sum_zeroelim(finlength, finnow, 4, u, finother);
                finswap = finnow;
                finnow = finother;
                finother = finswap;
            }
        }
    }

    if (bdxtail != 0.0) {
        if (cdytail != 0.0) {
            [bdxt_cdyt1, bdxt_cdyt0] = TwoProduct(bdxtail, cdytail);
            let [u3, u2, u1, u0] = TwoOneProduct(bdxt_cdyt1, bdxt_cdyt0, adz);

            u[3] = u3;
            u[2] = u2;
            u[1] = u1;
            u[0] = u0;

            finlength = fast_expansion_sum_zeroelim(finlength, finnow, 4, u, finother);
            finswap = finnow;
            finnow = finother;
            finother = finswap;

            if (adztail != 0.0) {
                [u3, u2, u1, u0] = TwoOneProduct(bdxt_cdyt1, bdxt_cdyt0, adztail);

                u[3] = u3;
                u[2] = u2;
                u[1] = u1;
                u[0] = u0;

                finlength = fast_expansion_sum_zeroelim(finlength, finnow, 4, u, finother);
                finswap = finnow;
                finnow = finother;
                finother = finswap;
            }
        }

        if (adytail != 0.0) {
            [bdxt_adyt1, bdxt_adyt0] = TwoProduct(-bdxtail, adytail);
            let [u3, u2, u1, u0] = TwoOneProduct(bdxt_adyt1, bdxt_adyt0, cdz);

            u[3] = u3;
            u[2] = u2;
            u[1] = u1;
            u[0] = u0;

            finlength = fast_expansion_sum_zeroelim(finlength, finnow, 4, u, finother);
            finswap = finnow;
            finnow = finother;
            finother = finswap;

            if (cdztail != 0.0) {
                [u3, u2, u1, u0] = TwoOneProduct(bdxt_adyt1, bdxt_adyt0, cdztail);

                u[3] = u3;
                u[2] = u2;
                u[1] = u1;
                u[0] = u0;

                finlength = fast_expansion_sum_zeroelim(finlength, finnow, 4, u, finother);
                finswap = finnow;
                finnow = finother;
                finother = finswap;
            }
        }
    }

    if (cdxtail != 0.0) {
        if (adytail != 0.0) {
            [cdxt_adyt1, cdxt_adyt0] = TwoProduct(cdxtail, adytail);
            let [u3, u2, u1, u0] = TwoOneProduct(cdxt_adyt1, cdxt_adyt0, bdz);

            u[3] = u3;
            u[2] = u2;
            u[1] = u1;
            u[0] = u0;

            finlength = fast_expansion_sum_zeroelim(finlength, finnow, 4, u, finother);
            finswap = finnow;
            finnow = finother;
            finother = finswap;

            if (bdztail != 0.0) {
                [u3, u2, u1, u0] = TwoOneProduct(cdxt_adyt1, cdxt_adyt0, bdztail);

                u[3] = u3;
                u[2] = u2;
                u[1] = u1;
                u[0] = u0;

                finlength = fast_expansion_sum_zeroelim(finlength, finnow, 4, u, finother);
                finswap = finnow;
                finnow = finother;
                finother = finswap;
            }
        }

        if (bdytail != 0.0) {
            [cdxt_bdyt1, cdxt_bdyt0] = TwoProduct(-cdxtail, bdytail);
            let [u3, u2, u1, u0] = TwoOneProduct(cdxt_bdyt1, cdxt_bdyt0, adz);

            u[3] = u3;
            u[2] = u2;
            u[1] = u1;
            u[0] = u0;

            finlength = fast_expansion_sum_zeroelim(finlength, finnow, 4, u, finother);
            finswap = finnow;
            finnow = finother;
            finother = finswap;

            if (adztail != 0.0) {
                [u3, u2, u1, u0] = TwoOneProduct(cdxt_bdyt1, cdxt_bdyt0, adztail);

                u[3] = u3;
                u[2] = u2;
                u[1] = u1;
                u[0] = u0;

                finlength = fast_expansion_sum_zeroelim(finlength, finnow, 4, u, finother);
                finswap = finnow;

                finnow = finother;
                finother = finswap;
            }
        }
    }

    if(adztail != 0.0) {
        [wlength, w] = ScaleExpansionZeroElim(bctlen, bct, adztail, w);

        finlength = fast_expansion_sum_zeroelim(finlength, finnow, wlength, w, finother);
        finswap = finnow;
        finnow = finother;
        finother = finswap;
    }

    if(bdztail != 0.0) {
        [wlength, w] = ScaleExpansionZeroElim(catlen, cat, bdztail, w);

        finlength = fast_expansion_sum_zeroelim(finlength, finnow, wlength, w, finother);
        finswap = finnow;
        finnow = finother;
        finother = finswap;
    }

    if(cdztail != 0.0) {
        [wlength, w] = ScaleExpansionZeroElim(abtlen, abt, cdztail, w);

        finlength = fast_expansion_sum_zeroelim(finlength, finnow, wlength, w, finother);
        finswap = finnow;
        finnow = finother;
        finother = finswap;
    }

    return finnow[finlength - 1];
}