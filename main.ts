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

// declare const __DEBUG__: boolean;

// if (__DEBUG__) {
//   console.log("Debugging mode is enabled.");
// }

const model = new Model();
const region1 = new Region();
const mmr = new MMR(model, region1);

mmr.execute();

const shell1 = new Shell(region1);
const vertex1 = new Vertex(new Point(0, 0, 0));
const vertex2 = new Vertex(new Point(1, 0, 0));
const vertex3 = new Vertex(new Point(1, 1, 0));
const vertex4 = new Vertex(new Point(0, 1, 0));
const vertex5 = new Vertex(new Point(0, 0, 1));
const vertex6 = new Vertex(new Point(1, 0, 1));
const vertex7 = new Vertex(new Point(1, 1, 1));
const vertex8 = new Vertex(new Point(0, 1, 1));
const vertex9 = new Vertex(new Point(0, -1, 0));

const msv = new MSV(region1, shell1, vertex1);

msv.execute();

const region2 = new Region();
const region3 = new Region();
const shell2 = new Shell(region2);
const shell3 = new Shell(region3);

const face1 = new Face();
const face2 = new Face();
const face3 = new Face();
const face4 = new Face();
const face5 = new Face();
const face6 = new Face();
const face7 = new Face();

const loop1 = new Loop();
const loop2 = new Loop();
const loop3 = new Loop();
const loop4 = new Loop();
const loop5 = new Loop();
const loop6 = new Loop();
const loop7 = new Loop();

const mrsfl = new MRSFL(vertex1, region1, region2, shell2, face1, loop1);

mrsfl.execute();

const edge1 = new Edge();
const edge2 = new Edge();
const edge3 = new Edge();
const edge4 = new Edge();
const edge5 = new Edge();
const edge6 = new Edge();
const edge7 = new Edge();
const edge8 = new Edge();
const edge9 = new Edge();
const edge10 = new Edge();
const edge11 = new Edge();
const edge12 = new Edge();
const edge13 = new Edge();
const edge14 = new Edge();


// criar a primeira face (inferior)
const mmev1 = new MMEV(vertex1, null, Direction.CCW, face1, Orientation.UNSPECIFIED, edge1, vertex2);
const mmev2 = new MMEV(vertex2, edge1, Direction.CCW, face1, Orientation.OUTSIDE, edge2, vertex3);
const mmev3 = new MMEV(vertex3, edge2, Direction.CCW, face1, Orientation.OUTSIDE, edge3, vertex4);
const mme1 = new MME(vertex4, edge3, Direction.CCW, vertex1, edge1, Direction.CW, face1, Orientation.OUTSIDE, edge4, face2, loop2);

// criar a segunda face (direita)
const mmev4 = new MMEV(vertex1, edge1, Direction.CCW, face1, Orientation.OUTSIDE, edge5, vertex5);
const mmev5 = new MMEV(vertex5, edge5, Direction.CCW, face1, Orientation.OUTSIDE, edge6, vertex6);
const mme2 = new MME(vertex6, edge6, Direction.CCW, vertex2, edge1, Direction.CW, face1, Orientation.OUTSIDE, edge7, face3, loop3);

// criar a terceira face (superior)
const mmev6 = new MMEV(vertex5, edge6, Direction.CCW, face1, Orientation.OUTSIDE, edge8, vertex8);
const mmev7 = new MMEV(vertex8, edge8, Direction.CCW, face1, Orientation.OUTSIDE, edge9, vertex7);
const mme3 = new MME(vertex7, edge9, Direction.CCW, vertex6, edge6, Direction.CW, face1, Orientation.OUTSIDE, edge10, face4, loop4);

// criar a quarta face (esquerda)
const mme4 = new MME(vertex8, edge8, Direction.CW, vertex4, edge4, Direction.CCW, face1, Orientation.OUTSIDE, edge11, face5, loop5);
const mme5 = new MME(vertex7, edge10, Direction.CCW, vertex3, edge2, Direction.CW, face1, Orientation.OUTSIDE, edge12, face6, loop6);

// criar face lamina
const mev = new MEV(vertex1, region2, edge13, vertex9);
const me = new ME(vertex9, vertex2, region1, edge14);
const mf = new MF([edge1, edge14, edge13], [face3, null, null], [Orientation.OUTSIDE, Orientation.UNSPECIFIED, Orientation.UNSPECIFIED], [Orientation.UNSPECIFIED, Orientation.UNSPECIFIED, Orientation.UNSPECIFIED], Orientation.OUTSIDE, face7, loop7, region3, shell3);

mmev1.execute();
mmev2.execute();
mmev3.execute();
mme1.execute();
mmev4.execute();
mmev5.execute();
mme2.execute();
mmev6.execute();
mmev7.execute();
mme3.execute();
mme4.execute();
mme5.execute();
mev.execute();
me.execute();
mf.execute();
// mme2.execute();
// mme3.execute();

// const exporter = new OBJFileIO(model);

// const exporter = new OBJFileIO(model);

// exporter.write("examples/output-2.obj");