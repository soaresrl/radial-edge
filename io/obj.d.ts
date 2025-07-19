import Point from "../geo/point";
import Model from "../red/model";
import Exporter from "./exporter";
import Importer from "./importer";
export default class OBJFileIO implements Importer, Exporter {
    vertices: Array<Point>;
    faces: Array<Array<number>>;
    normals: Array<Point>;
    model: Model;
    constructor(model: Model);
    write(file: string): void;
    read(obj: string): void;
    printLoops(): void;
    printFaces(): void;
    printOBJ(): string;
}
