import { Attribute, DescType } from "./definitions";
import EdgeUse from "./edgeuse";
import Face from "./face";
import { IsEdgeOnFaceResult } from "./sup";
import { CircularDoublyLinkedListItem } from "./utils";

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
}