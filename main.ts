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
import OBJFileIO from "./io/obj";

const model = new Model();
const region1 = new Region();
const mmr = new MMR(model, region1);

mmr.execute();

const shell1 = new Shell(region1);
const vertex1 = new Vertex(new Point(0, 0, 1));
const vertex2 = new Vertex(new Point(1, 0, 0));
const vertex3 = new Vertex(new Point(0, 0, 0));
const vertex4 = new Vertex(new Point(0, 1, 0));

const msv = new MSV(region1, shell1, vertex1);

msv.execute();

const region2 = new Region();
const shell2 = new Shell(region2);

const face1 = new Face();
const face2 = new Face();
const face3 = new Face();
const face4 = new Face();

const loop1 = new Loop();
const loop2 = new Loop();
const loop3 = new Loop();
const loop4 = new Loop();

const mrsfl = new MRSFL(vertex1, region1, region2, shell2, face1, loop1);

mrsfl.execute();

const edge1 = new Edge();
const edge2 = new Edge();
const edge3 = new Edge();
const edge4 = new Edge();
const edge5 = new Edge();
const edge6 = new Edge();

const mmev1 = new MMEV(vertex1, null, Direction.CCW, face1, Orientation.UNSPECIFIED, edge1, vertex4);
const mmev2 = new MMEV(vertex4, edge1, Direction.CCW, face1, Orientation.OUTSIDE, edge4, vertex2);

const mme1 = new MME(vertex1, edge1, Direction.CCW, vertex2, edge4, Direction.CCW, face1, Orientation.INSIDE, edge3, face2, loop2);

const mmev3 = new MMEV(vertex2, edge3, Direction.CCW, face1, Orientation.OUTSIDE, edge5, vertex3);

const mme2 = new MME(vertex3, edge5, Direction.CW, vertex1, edge3, Direction.CW, face1, Orientation.OUTSIDE, edge2, face3, loop3); 
const mme3 = new MME(vertex3, edge5, Direction.CW, vertex4, edge4, Direction.CCW, face3, Orientation.OUTSIDE, edge6, face4, loop4);

mmev1.execute();
mmev2.execute();
mme1.execute();
mmev3.execute();
mme2.execute();
mme3.execute();

const exporter = new OBJFileIO(model);

exporter.write("examples/output-2.obj");