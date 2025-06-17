import { Direction, Orientation } from "../definitions";

import Point from "../../geo/point";

import Region from "../region";
import Edge from "../edge";
import Face from "../face";
import Loop from "../loop";
import Shell from "../shell";
import Vertex from "../vertex";

import MME from "../operators/mme";
import MMEV from "../operators/mmev";
import MRSFL from "../operators/mrsfl";
import MSV from "../operators/msv";
import Vector from "../../geo/vector";

export default class Cube {
    static generate(region: Region, center: Point, width: number, height: number, depth: number) {
        const shell1 = new Shell(region);
        const vertex1 = new Vertex(center.add(new Vector(-width / 2, -height / 2, depth / 2)));
        const vertex2 = new Vertex(center.add(new Vector(width / 2, -height / 2, depth / 2)));
        const vertex3 = new Vertex(center.add(new Vector(width / 2, -height / 2, -depth / 2)));
        const vertex4 = new Vertex(center.add(new Vector(-width / 2, -height / 2, -depth / 2)));
        const vertex5 = new Vertex(center.add(new Vector(-width / 2, height / 2, depth / 2)));
        const vertex6 = new Vertex(center.add(new Vector(width / 2, height / 2, depth / 2)));
        const vertex7 = new Vertex(center.add(new Vector(-width / 2, height / 2, -depth / 2)));
        const vertex8 = new Vertex(center.add(new Vector(width / 2, height / 2, -depth / 2)));

        const msv = new MSV(region, shell1, vertex1);

        msv.execute();

        const region2 = new Region();
        const shell2 = new Shell(region2);

        const face1 = new Face();
        const face2 = new Face();
        const face3 = new Face();
        const face4 = new Face();
        const face5 = new Face();
        const face6 = new Face();

        const loop1 = new Loop();
        const loop2 = new Loop();
        const loop3 = new Loop();
        const loop4 = new Loop();
        const loop5 = new Loop();
        const loop6 = new Loop();

        const mrsfl = new MRSFL(vertex1, region, region2, shell2, face1, loop1);

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

        // criar a primeira face (inferior)
        const mmev1 = new MMEV(vertex1, null, Direction.CCW, face1, Orientation.UNSPECIFIED, edge1, vertex2);
        const mmev2 = new MMEV(vertex2, edge1, Direction.CCW, face1, Orientation.OUTSIDE, edge2, vertex3);
        const mmev3 = new MMEV(vertex3, edge2, Direction.CCW, face1, Orientation.OUTSIDE, edge3, vertex4);
        const mme1 = new MME(vertex4, edge3, Direction.CCW, vertex1, edge1, Direction.CW, face1, Orientation.OUTSIDE, edge4, face2, loop2);

        // criar a segunda face (next)
        const mmev4 = new MMEV(vertex1, edge1, Direction.CCW, face1, Orientation.OUTSIDE, edge5, vertex5);
        const mmev5 = new MMEV(vertex5, edge5, Direction.CCW, face1, Orientation.OUTSIDE, edge6, vertex6);
        const mme2 = new MME(vertex6, edge6, Direction.CCW, vertex2, edge1, Direction.CW, face1, Orientation.OUTSIDE, edge7, face3, loop3);

        // criar a terceira face (superior)
        const mmev6 = new MMEV(vertex5, edge6, Direction.CCW, face1, Orientation.OUTSIDE, edge8, vertex7);
        const mmev7 = new MMEV(vertex7, edge8, Direction.CCW, face1, Orientation.OUTSIDE, edge9, vertex8);
        const mme3 = new MME(vertex8, edge9, Direction.CCW, vertex6, edge6, Direction.CW, face1, Orientation.OUTSIDE, edge10, face4, loop4);

        // criar a quarta face (esquerda)
        const mme4 = new MME(vertex7, edge8, Direction.CW, vertex4, edge4, Direction.CCW, face1, Orientation.OUTSIDE, edge11, face5, loop5);
        const mme5 = new MME(vertex8, edge10, Direction.CCW, vertex3, edge2, Direction.CW, face1, Orientation.OUTSIDE, edge12, face6, loop6);

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
    }
}