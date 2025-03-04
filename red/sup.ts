import EdgeUse from "./edgeuse";
import FaceUse from "./faceuse";
import LoopUse from "./loopuse";
import Shell from "./shell";
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

export {
    VertexHasUseInRegion,
    IsVertexOnFaceResult,
    IsEdgeOnFaceResult
}