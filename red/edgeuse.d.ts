import { Attribute, DescType, Orientation } from "./definitions";
import Edge from "./edge";
import LoopUse from "./loopuse";
import Shell from "./shell";
import { CircularDoublyLinkedListItem } from "./utils";
import VertexUse from "./vertexuse";
export default class EdgeUse extends CircularDoublyLinkedListItem {
    static counter: number;
    id: number;
    vertexUse: VertexUse | null;
    mate: EdgeUse | null;
    edge: Edge | null;
    attribute?: Attribute;
    orientation: Orientation;
    up?: DescType;
    shell: Shell | null;
    loopuse: LoopUse | null;
    clockwiseEdgeUse: EdgeUse | null;
    counterClockwiseEdgeUse: EdgeUse | null;
    radial: EdgeUse | null;
    constructor();
    fill_eu_shell(vu: VertexUse, mate: EdgeUse, edge: Edge, shell: Shell, orient: Orientation): void;
    fill_eu_loopuse(vu: VertexUse, mate: EdgeUse, edge: Edge, lu: LoopUse, cw: EdgeUse | null, ccw: EdgeUse | null, radial: EdgeUse, orient: Orientation): void;
}
