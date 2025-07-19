import { DescType } from "./definitions";
import EdgeUse from "./edgeuse";
import FaceUse from "./faceuse";
import Region from "./region";
import { CircularDoublyLinkedListItem } from "./utils";
import VertexUse from "./vertexuse";
export default class Shell extends CircularDoublyLinkedListItem {
    static counter: number;
    id: number;
    region: Region | null;
    desc_type: DescType | null;
    faceuse: FaceUse | null;
    vertexuse: VertexUse | null;
    edgeuse: EdgeUse | null;
    constructor(region: Region);
    fill_s_faceuse(region: Region, shell_faceuse: FaceUse): void;
    for_all_faceuses(fu: FaceUse, first: FaceUse, flag: boolean, operation: () => void): void;
    for_all_fu_in_s(head: FaceUse, operation: (fu: FaceUse) => void): void;
    fill_shell_fu(fu: FaceUse): void;
}
