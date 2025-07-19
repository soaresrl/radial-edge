import { Attribute, DescType, Orientation } from "./definitions";
import Edge from "./edge";
import LoopUse from "./loopuse";
import Shell from "./shell";
import { CircularDoublyLinkedListItem } from "./utils";
import VertexUse from "./vertexuse";

export default class EdgeUse extends CircularDoublyLinkedListItem {
    public static counter: number = 0;
    public id: number;

    public vertexUse: VertexUse | null = null;
    public mate: EdgeUse | null = null;
    public edge: Edge | null = null;

    public attribute?: Attribute;
    public orientation: Orientation = Orientation.UNSPECIFIED;

    public up?: DescType;

    public shell: Shell | null = null;
    public loopuse: LoopUse | null = null;

    public clockwiseEdgeUse: EdgeUse | null = null;
    
    public counterClockwiseEdgeUse: EdgeUse | null = null;
    
    public radial: EdgeUse | null = null;

    constructor(){
        super();
        
        EdgeUse.counter++;
        this.id = EdgeUse.counter;
    }

    fill_eu_shell(vu: VertexUse, mate: EdgeUse, edge: Edge, shell: Shell, orient: Orientation) {
        this.vertexUse = vu;
        this.mate = mate;
        this.edge = edge;
        this.orientation = orient;
        this.up = DescType.SHELL;
        this.shell = shell;
    }
    
    fill_eu_loopuse(vu: VertexUse, mate: EdgeUse, edge: Edge, lu: LoopUse, cw: EdgeUse | null, ccw: EdgeUse | null, radial: EdgeUse, orient: Orientation) {
        this.vertexUse = vu;
        this.mate = mate;
        this.edge = edge;
        this.orientation = orient;
        this.up = DescType.LOOPUSE;
        this.loopuse = lu;
        this.clockwiseEdgeUse = cw;
        this.counterClockwiseEdgeUse = ccw;
        this.radial = radial;
    }
}