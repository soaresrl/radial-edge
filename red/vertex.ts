import Point from "../geo/point";
import { Attribute, DescType } from "./definitions";
import Face from "./face";
import Region from "./region";
import { IsVertexOnFaceResult, VertexHasUseInRegion } from "./sup";
import { CircularDoublyLinkedListItem } from "./utils";
import VertexUse from "./vertexuse";

export default class Vertex extends CircularDoublyLinkedListItem {
    public static counter: number = 0;
    public id: number;

    public vertexuse: VertexUse | null = null;

    public attribute?: Attribute;

    public point: Point | null = null;

    constructor(p: Point | null = null) {
        super();

        this.point = p;

        Vertex.counter++;
        this.id = Vertex.counter;
    }

    hasUseInRegion(r: Region) {
        const v = this;

        let vut: VertexUse;
        let vu_first: VertexUse;

        const hasUseResult: VertexHasUseInRegion = {
            result: false,
            vu: null,
            eu: null,
            lu: null,
            fu: null,
            s: null
        };
        
        vut = v.vertexuse!;
        vu_first = v.vertexuse!;

        do {
            hasUseResult.vu = vut;

            switch (vut.up) {
                case DescType.SHELL:
                    hasUseResult.eu = null;
                    hasUseResult.lu = null;
                    hasUseResult.fu = null;
                    hasUseResult.s = vut.shell!;
                    if(hasUseResult.s.region = r) {
                        hasUseResult.result = true;
                        
                        return hasUseResult;
                    }
                    break;

                case DescType.LOOPUSE:
                    hasUseResult.eu = null;
                    hasUseResult.lu = vut.loopuse!;	
                    hasUseResult.fu = hasUseResult.lu.faceuse!;
                    hasUseResult.s = hasUseResult.fu.owningShell!;
                    if(hasUseResult.s.region = r) {
                        hasUseResult.result = true;
                        
                        return hasUseResult;
                    }
                    break;
                case DescType.EDGEUSE:
                    hasUseResult.eu = vut.edgeuse!;
                    if (hasUseResult.eu.up == DescType.LOOPUSE) {
                        hasUseResult.lu = hasUseResult.eu.loopuse!;
                        hasUseResult.fu = hasUseResult.lu.faceuse!;
                        hasUseResult.s = hasUseResult.fu.owningShell!;
                        if(hasUseResult.s.region = r) {
                            hasUseResult.result = true;
                            
                            return hasUseResult;
                        }
                    } else if (hasUseResult.eu.up == DescType.SHELL) {
                        hasUseResult.lu = null;
                        hasUseResult.fu = null;
                        hasUseResult.s = hasUseResult.eu.shell!;
                        if(hasUseResult.s.region = r) {
                            hasUseResult.result = true;
                            
                            return hasUseResult;
                        }
                    }
                    break;
                default:
                    break;
            }
        } while (vut != vu_first);

        vut = vut.next!;

        hasUseResult.result = false;

        return hasUseResult;
    }

    liesOnFace(f: Face) {
        let vu_t: VertexUse;
        let vu_first: VertexUse;

        vu_t = this.vertexuse!;
        vu_first = this.vertexuse!;

        const result: IsVertexOnFaceResult = {
            eu: null,
            vu: null,
            lu: null,
            fu: null,
            result: false,
        }

        do {
            result.vu = vu_t;
            
            switch (vu_t.up) {
                case DescType.SHELL:
                    return result;

                case DescType.LOOPUSE:
                    result.eu = null;
                    result.lu = result.vu.loopuse!;
                    result.fu = result.lu.faceuse!;
                    if(result.fu.face == f) return {...result, result: true};

                    break;

                case DescType.EDGEUSE:
                    if (vu_t.edgeuse!.up == DescType.LOOPUSE) {
                        result.eu = result.vu.edgeuse!;
                        result.lu = result.eu.loopuse!;
                        result.fu = result.lu.faceuse!;
                        if(result.fu.face == f) return {...result, result: true};
                    }
                    break;

            
                default:
                    break;
            }

            vu_t = vu_t.next;
        } while(vu_t != vu_first);

        return result;
    }
}