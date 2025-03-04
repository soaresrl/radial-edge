import Face from "../face";
import Loop from "../loop";
import Region from "../region";
import Shell from "../shell";
import Vertex from "../vertex";
import Operator from "./operator";
export default class MRSFL extends Operator {
    vertex: Vertex;
    region: Region;
    newRegion: Region;
    newShell: Shell;
    newFace: Face;
    newLoop: Loop;
    constructor(v: Vertex, owning_region: Region, newR: Region, newS: Shell, newF: Face, newL: Loop);
    execute(): void;
    unexecute(): void;
}
