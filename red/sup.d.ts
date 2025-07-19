import { Orientation } from "./definitions";
import Edge from "./edge";
import EdgeUse from "./edgeuse";
import Face from "./face";
import FaceUse from "./faceuse";
import LoopUse from "./loopuse";
import Shell from "./shell";
import Vertex from "./vertex";
import VertexUse from "./vertexuse";
type VertexHasUseInRegion = {
    result: boolean;
    vu: VertexUse | null;
    eu: EdgeUse | null;
    lu: LoopUse | null;
    fu: FaceUse | null;
    s: Shell | null;
};
type IsVertexOnFaceResult = {
    result: boolean;
    vu: VertexUse | null;
    eu: EdgeUse | null;
    lu: LoopUse | null;
    fu: FaceUse | null;
};
type IsEdgeOnFaceResult = {
    result: boolean;
    eu: EdgeUse | null;
    lu: LoopUse | null;
    fu: FaceUse | null;
};
declare function red_i_eufu(vt: Vertex, e: Edge, f: Face, f_orient: Orientation, e_orient: Orientation): {
    eu: EdgeUse;
    lu: LoopUse;
    fu: FaceUse;
    result: boolean;
};
export { VertexHasUseInRegion, IsVertexOnFaceResult, IsEdgeOnFaceResult, red_i_eufu };
