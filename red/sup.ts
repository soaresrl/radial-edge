import { DescType, Orientation } from "./definitions";
import Edge from "./edge";
import EdgeUse from "./edgeuse";
import Face from "./face";
import FaceUse from "./faceuse";
import LoopUse from "./loopuse";
import Shell from "./shell";
import Vertex from "./vertex";
import VertexUse from "./vertexuse";

type VertexHasUseInRegion = {
    result: boolean,
    vu: VertexUse | null, 
    eu: EdgeUse | null, 
    lu: LoopUse | null, 
    fu: FaceUse | null, 
    s: Shell | null
}

type IsVertexOnFaceResult = {
    result: boolean,
    vu: VertexUse | null,
    eu: EdgeUse | null,
    lu: LoopUse | null,
    fu: FaceUse | null
}

type IsEdgeOnFaceResult = {
    result: boolean,
    eu: EdgeUse | null,
    lu: LoopUse | null,
    fu: FaceUse |null
}

function red_i_eufu(vt: Vertex, e: Edge, f: Face, f_orient: Orientation, e_orient: Orientation) {
    let eu_t: EdgeUse, eu_first: EdgeUse;
    let found: boolean = false;
    let flag: 'MATE' | 'RADIAL' = 'MATE';

    let eu: EdgeUse, lu: LoopUse, fu: FaceUse;

    eu_t = e.edgeuse;
    eu_first = e.edgeuse;

    do {
        switch (eu_t.up) {
            case DescType.LOOPUSE:
                eu = eu_t;
                lu = eu.loopuse;
                fu = lu.faceuse;
                if (fu.face == f && fu.orientation == f_orient) {
                    if (e_orient == Orientation.SAME) {
                        if(eu.orientation == Orientation.OPPOSITE && eu.vertexUse.vertex == vt) {
                            found = true;
                        }
                    } else if (e_orient == Orientation.OPPOSITE) {
                        if(eu.orientation == Orientation.SAME && eu.vertexUse.vertex == vt) {
                            found = true;
                        }
                    } else {
                        if(eu.vertexUse.vertex == vt) {
                            found = true;
                        }
                    }
                }
                break;
            default:
                return {eu, lu, fu, result: found};
        }

        if (found) break;

        if (flag == 'MATE') {
            eu_t = eu_t.mate;
            flag = 'RADIAL';
        } else {
            eu_t = eu_t.radial!;
            flag = 'MATE';
        }
    } while (eu_t != eu_first);

    return {eu, lu, fu, result: found};
}

export {
    VertexHasUseInRegion,
    IsVertexOnFaceResult,
    IsEdgeOnFaceResult,
    red_i_eufu
}