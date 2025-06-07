import Point from "../geo/point";
import { DescType, Orientation } from "../red/definitions";
import Model from "../red/model";
import Vertex from "../red/vertex";
import Exporter from "./exporter";
import Importer from "./importer";

import * as fs from 'fs';

export default class TopoIO implements Importer, Exporter {
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

        const vertices = [];
        const vertices_points = new Map<number, Point>();
        const visited_vertices = new Map<number, boolean>();

        type RegionTable = {
            id: number,
            model: number,
            shell: number
        }

        type ShellTable = {
            id: number,
            region: number,
            dwnPtrType: DescType,
            faceuse: number,
            vertexuse: number,
            edgeuse: number,
        }

        type FaceTable = {
            id: number,
            faceuse: number,
        }

        type FaceUseTable = {
            id: number,
            next: number,
            last: number,
            orient: Orientation,
            loopuse: number,
            mate: number,
            ownerFace: number,
            ownerShell: number,
        }

        type LoopTable = {
            id: number,
            loopuse: number,
        }

        type LoopUseTable = {
            id: number,
            next: number,
            last: number,
            faceuse: number,
            loop: number,
            mate: number,
            dwnPtrType: DescType,
            edgeuse: number,
            vertexuse: number,
        }

        type EdgeTable = {
            id: number,
            edgeuse: number,
        }

        type EdgeUseTable = {
            id: number,
            edge: number,
            vertexuse: number,
            orient: Orientation,
            upPtrType: DescType,
            shell: number,
            loopuse: number,
            cwEdgeUse: number,
            ccwEdgeUse: number,
            mate: number,
            radial: number,
        }

        type VertexTable = {
            id: number,
            vertexuse: number,
            x: number,
            y: number,
            z: number
        }

        type VertexUseTable = {
            id: number,
            vertex: number,
            next: number,
            last: number,
            upPtrType: number,
            shell: number,
            loopuse: number,
            edgeuse: number,
        }


        const regionTable = new Array<RegionTable>();
        const shellTable = new Array<ShellTable>();
        const faceTable = new Array<FaceTable>();
        const faceUseTable = new Array<FaceUseTable>();
        const loopTable = new Array<LoopTable>();
        const loopUseTable = new Array<LoopUseTable>();
        const edgeTable = new Array<EdgeTable>();
        const edgeUseTable = new Array<EdgeUseTable>();
        const vertexTable = new Array<VertexTable>();
        const vertexUseTable = new Array<VertexUseTable>();


        do {
            // if (region_t.id === 2) {
            //     region_t = region_t.next;
            //     continue;
            // }
            let shell_t = region_t.shell;
            // if (shell_t.faceuse.orientation == Orientation.INSIDE) {
            //     shell_t = shell_t.faceuse.mate.owningShell;
            //     region_t = shell_t.region;
            //     continue;
            // }

            const first_fu = shell_t.faceuse;
            let fu_t = shell_t.faceuse;

            regionTable.push({
                id: region_t.id,
                model: region_t.model.id,
                shell: shell_t.id
            });

            shellTable.push({
                id: shell_t.id,
                region: shell_t.region.id,
                dwnPtrType: shell_t.desc_type,
                faceuse: shell_t.faceuse?.id,
                vertexuse: shell_t.vertexuse?.id,
                edgeuse: shell_t.edgeuse?.id
            });
            
            do {
                if (!faceTable.find((f) => f.id === fu_t.face.id)){
                    faceTable.push({
                        id: fu_t.face.id,
                        faceuse: fu_t.id
                    });   
                }
                
                faceUseTable.push({
                    id: fu_t.id,
                    next: fu_t.next?.id,
                    last: fu_t.last?.id,
                    orient: fu_t.orientation,
                    loopuse: fu_t.loopuse.id,
                    mate: fu_t.mate?.id,
                    ownerFace: fu_t.face?.id,
                    ownerShell: fu_t.owningShell?.id
                });

                let lu_t = fu_t.loopuse;
                const first_lu = fu_t.loopuse;
                do {
                    if (!loopTable.find((l) => l.id === lu_t.id)){
                        loopTable.push({
                            id: lu_t.id,
                            loopuse: lu_t.id
                        });   
                    }

                    loopUseTable.push({
                        id: lu_t.id,
                        next: lu_t.next?.id,
                        last: lu_t.last?.id,
                        faceuse: lu_t.faceuse?.id,
                        loop: lu_t.loop?.id,
                        mate: lu_t.mate?.id,
                        dwnPtrType: lu_t.down,
                        edgeuse: lu_t.edgeuse.id,
                        vertexuse: lu_t.vertexuse?.id
                    });

                    const first_eu = lu_t.edgeuse;
                    let eu_t = lu_t.edgeuse;

                    do {
                        // if (!visited_vertices.has(eu_t.vertexUse.vertex.id)){
                        //     vertices.push(eu_t.vertexUse.vertex.id);
                        //     vertices_points.set(eu_t.vertexUse.vertex.id, eu_t.vertexUse.vertex.point);
                        //     visited_vertices.set(eu_t.vertexUse.vertex.id, true);
                        // }
                        if (!edgeTable.find((e) => e.id === eu_t.edge.id)){
                            edgeTable.push({
                                id: eu_t.edge.id,
                                edgeuse: eu_t.id
                            });   
                        }

                        edgeUseTable.push({
                            id: eu_t.id,
                            edge: eu_t.edge.id,
                            vertexuse: eu_t.vertexUse.id,
                            orient: eu_t.orientation,
                            upPtrType: eu_t.up,
                            shell: eu_t.shell?.id,
                            loopuse: eu_t.loopuse.id,
                            cwEdgeUse: eu_t.clockwiseEdgeUse?.id,
                            ccwEdgeUse: eu_t.counterClockwiseEdgeUse?.id,
                            mate: eu_t.mate?.id,
                            radial: eu_t.radial?.id
                        });

                        let vu_t = eu_t.vertexUse;
                        const first_vu = eu_t.vertexUse;
                        do {
                            if (!vertexTable.find((v) => v.id === vu_t.vertex.id)){
                                vertexTable.push({
                                    id: vu_t.vertex.id,
                                    vertexuse: vu_t.id,
                                    x: vu_t.vertex.point.x,
                                    y: vu_t.vertex.point.y,
                                    z: vu_t.vertex.point.z
                                });  
                                
                                continue;
                            }

                            if (!vertexUseTable.find((v) => v.id === vu_t.id)){
                                vertexUseTable.push({
                                    id: vu_t.id,
                                    vertex: vu_t.vertex.id,
                                    next: vu_t.next?.id,
                                    last: vu_t.last?.id,
                                    upPtrType: vu_t.up,
                                    shell: vu_t.shell?.id,
                                    loopuse: vu_t.loopuse?.id,
                                    edgeuse: vu_t.edgeuse?.id
                                });   
                            }
                            vu_t = vu_t.next;
                        } while (vu_t !== first_vu);

                        // faces.set(fu_t.face.id, [...(faces.get(fu_t.face.id) || []), eu_t.vertexUse.vertex.id]);

                        eu_t = eu_t.clockwiseEdgeUse;
                    } while (eu_t !== first_eu);
                } while (lu_t !== first_lu);

                fu_t = fu_t.next;
            } while (fu_t !== first_fu);

            region_t = region_t.next;
        } while (region_t !== first_region);

        // vertices.sort();
        // for (let vertex of vertices){
        //     str += `v ${vertices_points.get(vertex).x} ${vertices_points.get(vertex).y} ${vertices_points.get(vertex).z}\n`;
        //     // console.log("v ", [vertices_points.get(vertex).x, vertices_points.get(vertex).y, vertices_points.get(vertex).z].join(" "));
        // }

        // for (let [face, vertices] of faces){
        //     str += `f ${vertices.join(" ")}\n`;
        //     // console.log("f ", vertices.join(" "));
        // }

        console.log("-------- REGION TABLE ---------");
        for(let region in regionTable){
            console.log("Region: ", regionTable[region].id, "Model: ", regionTable[region].model, "Shell: ", regionTable[region].shell);
        }

        console.log("-------- SHELL TABLE ---------");
        for(let shell in shellTable){
            console.log("Shell: ", shellTable[shell].id, "Region: ", shellTable[shell].region, "DwnPtrType: ", shellTable[shell].dwnPtrType, "FaceUse: ", shellTable[shell].faceuse, "VertexUse: ", shellTable[shell].vertexuse, "EdgeUse: ", shellTable[shell].edgeuse);
        }

        console.log("-------- FACE TABLE ---------");
        for(let face in faceTable){
            console.log("Face: ", faceTable[face].id, "FaceUse: ", faceTable[face].faceuse);
        }

        console.log("-------- FACEUSE TABLE ---------");
        for(let shell in faceUseTable){
            console.log("FaceUse: ", faceUseTable[shell].id, "Next: ", faceUseTable[shell].next, "Last: ", faceUseTable[shell].last, "Orient: ", faceUseTable[shell].orient, "LoopUse: ", faceUseTable[shell].loopuse, "Mate: ", faceUseTable[shell].mate, "OwnerFace: ", faceUseTable[shell].ownerFace, "OwnerShell: ", faceUseTable[shell].ownerShell);
        }

        console.log("-------- LOOP TABLE ---------");
        for(let loop in loopTable){
            console.log("Loop: ", loopTable[loop].id, "LoopUse: ", loopTable[loop].loopuse);
        }

        console.log("-------- LOOPUSE TABLE ---------");
        for(let loop in loopUseTable){
            console.log("LoopUse: ", loopUseTable[loop].id, "Next: ", loopUseTable[loop].next, "Last: ", loopUseTable[loop].last, "FaceUse: ", loopUseTable[loop].faceuse, "Loop: ", loopUseTable[loop].loop, "Mate: ", loopUseTable[loop].mate, "DwnPtrType: ", loopUseTable[loop].dwnPtrType, "EdgeUse: ", loopUseTable[loop].edgeuse, "VertexUse: ", loopUseTable[loop].vertexuse);
        }

        console.log("-------- EDGE TABLE ---------");
        for(let edge in edgeTable){
            console.log("Edge: ", edgeTable[edge].id, "EdgeUse: ", edgeTable[edge].edgeuse);
        }

        console.log("-------- EDGEUSE TABLE ---------");
        for(let edge in edgeUseTable){
            console.log("EdgeUse: ", edgeUseTable[edge].id, "Edge: ", edgeUseTable[edge].edge, "VertexUse: ", edgeUseTable[edge].vertexuse, "Orient: ", edgeUseTable[edge].orient, "UpPtrType: ", edgeUseTable[edge].upPtrType, "Shell: ", edgeUseTable[edge].shell, "LoopUse: ", edgeUseTable[edge].loopuse, "CwEdgeUse: ", edgeUseTable[edge].cwEdgeUse, "CcwEdgeUse: ", edgeUseTable[edge].ccwEdgeUse, "Mate: ", edgeUseTable[edge].mate, "Radial: ", edgeUseTable[edge].radial);
        }

        console.log("-------- VERTEX TABLE ---------");
        for(let vertex in vertexTable){
            console.log("Vertex: ", vertexTable[vertex].id, "VertexUse: ", vertexTable[vertex].vertexuse, "X: ", vertexTable[vertex].x, "Y: ", vertexTable[vertex].y, "Z: ", vertexTable[vertex].z);
        }

        console.log("-------- VERTEXUSE TABLE ---------");
        for(let vertex in vertexUseTable){
            console.log("VertexUse: ", vertexUseTable[vertex].id, "Vertex: ", vertexUseTable[vertex].vertex, "Next: ", vertexUseTable[vertex].next, "Last: ", vertexUseTable[vertex].last, "UpPtrType: ", vertexUseTable[vertex].upPtrType, "Shell: ", vertexUseTable[vertex].shell, "LoopUse: ", vertexUseTable[vertex].loopuse, "EdgeUse: ", vertexUseTable[vertex].edgeuse);
        }

        return str;
    }
}