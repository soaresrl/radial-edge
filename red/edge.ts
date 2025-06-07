import { Attribute, DescType, Orientation } from "./definitions";
import EdgeUse from "./edgeuse";
import Face from "./face";
import FaceUse from "./faceuse";
import LoopUse from "./loopuse";
import Shell from "./shell";
import { IsEdgeOnFaceResult, red_i_eufu } from "./sup";
import { CircularDoublyLinkedListItem } from "./utils";
import Vertex from "./vertex";

export default class Edge extends CircularDoublyLinkedListItem {
    public static counter = 0;

    public id: number = 0;
    public edgeuse: EdgeUse | null = null;

    public attribute?: Attribute;

    constructor(){
        super();

        Edge.counter++;
        this.id = Edge.counter;
    }

    liesOnFace(f: Face) {
        let eu_t: EdgeUse;
        let eu_first: EdgeUse;

        let flag: 'MATE' | 'RADIAL' = 'MATE';

        eu_t = this.edgeuse!;
        eu_first = this.edgeuse!;

        const result: IsEdgeOnFaceResult = {
            eu: null,
            lu: null,
            fu: null,
            result: false,
        }

        do {
            switch (eu_t.up) {
                case DescType.SHELL :
                    return result;
                case DescType.LOOPUSE:
                    result.eu = eu_t;
                    result.lu = result.eu.loopuse!;
                    result.fu = result.lu.faceuse!;
                    if(result.fu.face == f) return {...result, result: true}
                    break;
                default:
                    break;
            }

            if (flag == 'MATE') {
                eu_t = eu_t.mate!;
                flag = 'RADIAL';
            } else {
                eu_t = eu_t.radial!;
                flag = 'MATE';
            }
        } while (eu_t != eu_first);

        return result;
    }

    static isInLoop(e_list: Edge[], f_list: Face[], f_orients: Orientation[], e_orients: Orientation[])  {
        let vt: Vertex, v0: Vertex, v1: Vertex, v2: Vertex, v3: Vertex;
        let first_wireeu: EdgeUse;
        let first_faceuse: FaceUse;
        
        let found_face: boolean = false;
        let found_wire: boolean = false;

        let cls: boolean = false;

        let s: Shell;
        let v_first: Vertex;

        const n = e_list.length;

        v0 = e_list[n - 1].edgeuse.vertexUse.vertex;
        v1 = e_list[n - 1].edgeuse.mate.vertexUse.vertex;
        v2 = e_list[0].edgeuse.vertexUse.vertex;
        v3 = e_list[0].edgeuse.mate.vertexUse.vertex;

        if (v0 == v2) v_first = v0;
        else if (v1 == v2) v_first = v1;
        else if (v0 == v3) v_first = v0;
        else if (v1 == v3) v_first = v1;
        else return {v: v_first, s, result: false};

        vt = v_first;
        
        for (let i = 0; i < n; i++) {
            v0 = e_list[i].edgeuse.vertexUse.vertex;
            v1 = e_list[i].edgeuse.mate.vertexUse.vertex;

            if((e_orients[i] == Orientation.UNSPECIFIED) || (e_list[i].edgeuse.up == DescType.SHELL)) {
                if (v0 == vt) vt = v1;
                else if (v1 == vt) vt = v0;
                else return {v: v_first, s, result: false};
            } else if (e_orients[i] == Orientation.SAME) {
                if(e_list[i].edgeuse.orientation == Orientation.SAME) {
                    if (v0 == vt) vt = v1;
                    else return {v: v_first, s, result: false};
                } else {
                    if (v1 == vt) vt = v0;
                    else return {v: v_first, s, result: false};
                }
            } else if (e_orients[i] == Orientation.OPPOSITE) {
                if(e_list[i].edgeuse.orientation == Orientation.SAME) {
                    if (v1 == vt) vt = v0;
                    else return {v: v_first, s, result: false};
                } else {
                    if (v0 == vt) vt = v1;
                    else return {v: v_first, s, result: false};
                }
            } else return {v: v_first, s, result: false};

            if (e_list[i].edgeuse.up == DescType.LOOPUSE) {
                let { fu: fu_dum, result } = red_i_eufu(vt, e_list[i], f_list[i], f_orients[i], e_orients[i])
                if (!result) {
                    return {v: v_first, s, result: false};
                }

                if(!found_face) {
                    first_faceuse = fu_dum;
                    found_face = true;
                }
            } else {
                if(f_list[i] != null) {
                    return {v: v_first, s, result: false};
                }

                if(!found_wire) {
                    first_wireeu = e_list[i].edgeuse;
                    found_wire = true;
                }
            }
        }

        cls = true;

        if(found_face) {
            s = first_faceuse.owningShell;
        } else {
            s = first_wireeu.shell
        }

        return {s, v: v_first, result: cls};
    }
}