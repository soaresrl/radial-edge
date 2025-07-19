import Model from "./red/model";
import MMR from "./red/operators/mmr";
import MSV from "./red/operators/msv";
import Operator from "./red/operators/operator";
import Region from "./red/region";
import Shell from "./red/shell";
import Vertex from "./red/vertex";
import DoublyLinkedList from "./crdt/modelingops";
import MRSFL from "./red/operators/mrsfl";
import Face from "./red/face";
import Loop from "./red/loop";
import { MEV } from "./red/operators/mev";
import Point from "./geo/point";
import MMEV from "./red/operators/mmev";
import { Direction, Orientation } from "./red/definitions";
import Edge from "./red/edge";
import MME from "./red/operators/mme";
// import OBJFileIO from "./io/obj";
// import TopoIO from "./io/topo";
import ME from "./red/operators/me";
import MF from "./red/operators/mf";
import Cube from "./red/primitives/cube";
import OBJFileIO from "./io/obj";

// declare const __DEBUG__: boolean;

// if (__DEBUG__) {
//   console.log("Debugging mode is enabled.");
// }

const model = new Model();
const region1 = new Region();
const mmr = new MMR(model, region1);

mmr.execute();

Cube.generate(region1, new Point(0, 2.5, 0), 2, 5, 2);
// Cube.generate(region1, new Point(0, 5, 3), 2, 10, 2);
// Cube.generate(region1, new Point(3, 7.5, 0), 2, 15, 2);
// Cube.generate(region1, new Point(3, 10, 3), 2, 20, 2);
// mme2.execute();
// mme3.execute();

const exporter = new OBJFileIO(model);

// const exporter = new OBJFileIO(model);

exporter.write("examples/output-2.obj");