import Point from "../geo/point";
import { DescType, Orientation } from "../red/definitions";
import Model from "../red/model";
import Tesselation from "../utils/tesselate";
import Exporter from "./exporter";
import Importer from "./importer";

import * as fs from 'fs';

export default class OBJFileIO implements Importer, Exporter {
    public vertices: Array<Point>;
    public faces: Array<Array<number>>;
    public normals: Array<Point>;

    public model: Model;

    constructor(model: Model){
        this.vertices = [];
        this.faces = [];
        this.normals = [];

        this.model = model;
    }

    // public write(address: string): string {
    //     let first_fu = this.model.region!.shell!.faceuse!;
    //     let fu_t = this.model.region!.shell!.faceuse!;

    //     const tempFaceVertices = [];

    //     do {
    //         let lu_first = fu_t!.loopuse;
    //         let lu_t = fu_t!.loopuse;

    //         console.log("F: ", fu_t!.face!.id);

    //         do {
    //             let eu_first = lu_t!.edgeuse;
    //             let eu_t = lu_t!.edgeuse;

    //             do {
    //                 console.log("V: ", eu_t!.vertexUse!.vertex!.id);

    //                 eu_t = eu_t!.clockwiseEdgeUse!;
    //             } while (eu_first !== eu_t);

    //             lu_t = lu_t!.next!;
    //         } while (lu_t !== lu_first);
            
    //         fu_t = fu_t!.next!;
    //     } while (fu_t !== first_fu);
        
    //     let obj = "";

    //     for (let v of this.vertices){
    //         obj += `v ${v.x} ${v.y} ${v.z}\n`;
    //     }

    //     // for (let n of this.normals){
    //     //     obj += `vn ${n.x} ${n.y} ${n.z}\n`;
    //     // }

    //     for (let f of this.faces){
    //         obj += `f ${f.map((i, index) => `${i}//${index + 1}`).join(" ")}\n`;
    //     }

    //     return obj;
    // }
    write(file: string): void {
        // this.printLoops();
        // this.printFaces();
        // this.printOBJ();
        fs.writeFileSync(file, this.printOBJ(), {encoding: 'utf-8'});
    }

    read(obj: string): void {
        const lines = obj.split("\n");

        for (let line of lines){
            const parts = line.split(" ");
            if (parts[0] === "v"){
                this.vertices.push(new Point(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])));
            } else if (parts[0] === "vn"){
                this.normals.push(new Point(parseFloat(parts[1]), parseFloat(parts[2]), parseFloat(parts[3])));
            } else if (parts[0] === "f"){
                this.faces.push(parts.slice(1).map((part) => parseInt(part.split("/")[0])));
            }
        }
    }

    printLoops() {
        const first_region = this.model.region;

        let region_t = this.model.region;
        do {
            const first_shell = region_t.shell;
            let shell_t = region_t.shell;
            // do {
                if (shell_t.faceuse.orientation != Orientation.INSIDE) {
                    shell_t = shell_t.faceuse.mate.owningShell;
                    region_t = shell_t.region;
                    continue;
                }

                const first_fu = shell_t.faceuse;
                let fu_t = shell_t.faceuse;
                
                do {
                    // console.log("F: ", fu_t.face.id);
                    console.log("L: ", fu_t.loopuse.id);

                    const first_eu = fu_t.loopuse.edgeuse;
                    let eu_t = fu_t.loopuse.edgeuse;

                    do {
                        // console.log("V: ", eu_t.vertexUse.vertex.id);
                        console.log("E: ", eu_t.edge.id);

                        const first_vu = eu_t.vertexUse;
                        let vu_t = eu_t.vertexUse;

                        // do {
                        //     console.log("VU: ", vu_t.id);

                        //     vu_t = vu_t.next;

                        //     // Next: iterate over a face use's edge uses and print the vertex uses
                        // } while (vu_t !== first_vu);

                        eu_t = eu_t.clockwiseEdgeUse;
                    } while (eu_t != first_eu);

                    fu_t = fu_t.next;
                } while (fu_t !== first_fu);

                // shell_t = shell_t.next
            // } while (shell_t !== first_shell);

            region_t = region_t.next;
        } while (region_t !== first_region);
        
    }

    printFaces() {
        const first_region = this.model.region;

        let region_t = this.model.region;
        do {
            let shell_t = region_t.shell;
            if (shell_t.faceuse.orientation != Orientation.INSIDE) {
                shell_t = shell_t.faceuse.mate.owningShell;
                region_t = shell_t.region;
                continue;
            }

            const first_fu = shell_t.faceuse;
            let fu_t = shell_t.faceuse;
            
            do {
                console.log("F: ", fu_t.face.id);

                const first_eu = fu_t.loopuse.edgeuse;
                let eu_t = fu_t.loopuse.edgeuse;

                do {
                    console.log("V: ", eu_t.vertexUse.vertex.id);

                    eu_t = eu_t.clockwiseEdgeUse;
                } while (eu_t != first_eu);

                fu_t = fu_t.next;
            } while (fu_t !== first_fu);

            region_t = region_t.next;
        } while (region_t !== first_region);
        
    }

    printOBJ() {
        let str = "o Radial Edge\n";
        const first_region = this.model.region;

        const faces = new Map<number, number[]>();

        let region_t = this.model.region;

        const obj_vertices: Array<number> = [];
        const obj_vertices_points = new Map<number, Point>();

        let obj_vertex_index = 1;
        const map_brep_to_obj_vertex = new Map<number, number>();
        do {
            console.log("Region: ", region_t.id)
            if (region_t.id == 1) break;
            let shell_t = region_t.shell;
            // if (shell_t.faceuse.orientation != Orientation.OUTSIDE) {
            //     shell_t = shell_t.faceuse.mate.owningShell;
            //     region_t = shell_t.region;
            //     continue;
            // }

            const first_fu = shell_t.faceuse;
            let fu_t = shell_t.faceuse;
            
            do {
                const first_eu = fu_t.loopuse.edgeuse;
                let eu_t = fu_t.loopuse.edgeuse;
                console.log("Face: ", fu_t.face.id);

                do {
                    if (!map_brep_to_obj_vertex.has(eu_t.vertexUse.vertex.id)){
                        map_brep_to_obj_vertex.set(eu_t.vertexUse.vertex.id, obj_vertex_index);
                        obj_vertices.push(obj_vertex_index)
                        obj_vertices_points.set(obj_vertex_index, eu_t.vertexUse.vertex.point);

                        obj_vertex_index++;
                    }
                    console.log("vertex: ", eu_t.vertexUse.vertex.id, "coords:", `x: ${eu_t.vertexUse.vertex.point.x}, y: ${eu_t.vertexUse.vertex.point.y}, z: ${eu_t.vertexUse.vertex.point.z}`)

                    if(!faces.get(fu_t.face.id)){
                        faces.set(fu_t.face.id, [map_brep_to_obj_vertex.get(eu_t.vertexUse.vertex.id)])
                    } else {
                        faces.get(fu_t.face.id).push(map_brep_to_obj_vertex.get(eu_t.vertexUse.vertex.id));
                    }

                    eu_t = eu_t.clockwiseEdgeUse;
                } while (eu_t !== first_eu);

                fu_t = fu_t.next;
            } while (fu_t !== first_fu);

            region_t = region_t.next;
        } while (region_t !== first_region);

        // vertices.sort();
        for (let vertex of obj_vertices){
            str += `v ${obj_vertices_points.get(vertex).x} ${obj_vertices_points.get(vertex).y} ${obj_vertices_points.get(vertex).z}\n`;
            // console.log("v ", [vertices_points.get(vertex).x, vertices_points.get(vertex).y, vertices_points.get(vertex).z].join(" "));
        }

        // let tris: number[][] = [];
        for (let [face, vertices] of faces){
            str += `f ${vertices.join(" ")}\n`;

            // console.log(vertices);
            // const points = vertices.map((v_id) => {
            //     return obj_vertices_points.get(v_id)
            // });
            // const tesResult = Tesselation.tesselate3D(points)

            // tris = [...tris, ...tesResult.map(tri => tri.map(id => vertices[id]))];
        }
        // console.log(tris.length)

        // for(let tri of tris) {
        //     str += `f ${tri.join(" ")}\n`;

        //     console.log(tri)
        // }

        return str;
    }
}