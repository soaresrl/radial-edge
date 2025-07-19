import { Orientation } from "../definitions";
import Edge from "../edge";
import Face from "../face";
import Loop from "../loop";
import Region from "../region";
import Shell from "../shell";
import Operator from "./operator";
export default class MF extends Operator {
    edge_list: Array<Edge>;
    face_list: Array<Face>;
    f_orients: Array<Orientation>;
    e_orients: Array<Orientation>;
    newf_orient: Orientation;
    new_face: Face;
    new_loop: Loop;
    new_region: Region;
    new_shell: Shell;
    constructor(edge_list: Array<Edge>, face_list: Array<Face>, f_orients: Array<Orientation>, e_orients: Array<Orientation>, newf_orient: Orientation, new_face: Face, new_loop: Loop, new_region: Region, new_shell: Shell);
    execute(): void;
    unexecute(): void;
}
