import { ArcballControls } from "three/examples/jsm/controls/ArcballControls";
import { plane, wave } from "./examples/meshes/superfie_1";
import Line from "./geo/line";
import Point from "./geo/point";
import Triangle from "./geo/triangle";
// import OBJFileIO from "./io/obj";
import Edge from "./red/edge";
import Model from "./red/model";
import MMR from "./red/operators/mmr";
import Cube from "./red/primitives/cube";
import Region from "./red/region";
import Vertex from "./red/vertex";
import Intersection from "./utils/intersection";
import RTree, { Node } from "./utils/rtree";
import Tesselation from "./utils/tesselate";
import * as THREE from "three";
import Face from "./red/face";
import MME from "./red/operators/mme";
import Loop from "./red/loop";
import { DescType, Direction, Orientation } from "./red/definitions";
import EdgeUse from "./red/edgeuse";
import { for_all_eu_in_s } from "./red/utils";
import BoundingBox from "./utils/bbox";

type Pair = {
    first: Point,
    second: Point
}

function boundaryPointsOfFace(face: Face) {
    let eu_t = face.faceuse.loopuse.edgeuse;
    const first_eu = face.faceuse.loopuse.edgeuse;

    const points: Point[] = [];
    do {
        points.push(eu_t.vertexUse.vertex.point);

        eu_t = eu_t.counterClockwiseEdgeUse;
    } while (eu_t != first_eu)

    return points;
}

const curve: Point[] = [];

const facesVisitedList: {face1: Face, face2: Face}[] = [];
const edgesfacesVisitedList: {edge: Edge, face: Face}[] = [];

function sleep(ms: number) {
    return new Promise<void>((resolve) => {
        document.addEventListener("keydown", (ev) => {
            if (ev.key == "n") {
                // document.removeEventListener()
                resolve()
            }
        })
    });
}

function searchIntersections(triangleA: Face, triangleB: Face) {
    if (facesVisitedList.find(({face1, face2}) => (face1 == triangleA && face2 == triangleB) || (face1 == triangleB && face2 == triangleA))) {
        console.log("found")
        return
    };
    
    // console.log(facesVisitedList.length);
    facesVisitedList.push({face1: triangleA, face2: triangleB});

    const pairs: Pair[] = [];
    const intersections: Point[] = []

    let eu_t = triangleA.faceuse.loopuse.edgeuse;
    const first_eu = triangleA.faceuse.loopuse.edgeuse;

    // const pOfA = boundaryPointsOfFace(triangleA);
    
    const visitedEdges: Edge[] = [];
    // const queue: EdgeUse[] = [];
    const queue_edge_tri: {eu: EdgeUse, face: Face}[] = [];

    // Add all face's edges to queue
    do {
        // queue.push(eu_t);
        queue_edge_tri.push({eu: eu_t, face: triangleB});

        eu_t = eu_t.counterClockwiseEdgeUse;
    } while (eu_t != first_eu);

    let eu_tB = triangleB.faceuse.loopuse.edgeuse;
    const first_euB = triangleB.faceuse.loopuse.edgeuse;

    // Add all face's edges to queue
    do {
        // queue.push(eu_t);
        queue_edge_tri.push({eu: eu_tB, face: triangleA});

        eu_tB = eu_tB.counterClockwiseEdgeUse;
    } while (eu_tB != first_euB);

    while(queue_edge_tri.length > 0) {
        const {eu, face} = queue_edge_tri.pop();

        console.log(queue_edge_tri.length);

        // if (edgesfacesVisitedList.find(({edge, face: f}) => (edge == eu.edge && f == face))) {
        //     console.log("found");
        //     continue;
        // };

        if (eu.edge.visited) {
            console.log("edge visited");
            continue;
        };

        // edgesfacesVisitedList.push({edge: eu.edge, face})


        const line = new Line(eu.vertexUse.vertex.point, eu.mate.vertexUse.vertex.point);

        const pOfT = face.getFaceOuterVertices();
        // const pOfB = triangleB.getFaceOuterVertices();
        const tri = new Triangle(pOfT[0], pOfT[1], pOfT[2]);
        // const tB = new Triangle(pOfB[0], pOfB[1], pOfB[2]);
 
        const intersection = Intersection.segmentTriangleIntersectionExact(line, tri);
        
        eu.edge.visited = true;
        visitedEdges.push(eu.edge);

        if(intersection) {
            intersections.push(intersection);
            curve.push(intersection);

            // Add all neighbours faces' edgeuses to queue
            // Making it traverse through neighbours is causing duplicates intersections
            let eu_radial_t = eu.radial;
            do {
                let eu_face_t = eu_radial_t;
                const first_eu_face_t = eu_face_t;
                
                do {
                    queue_edge_tri.push({eu: eu_face_t, face});
                    eu_face_t = eu_face_t.counterClockwiseEdgeUse;
                } while (eu_face_t != first_eu_face_t)

                eu_radial_t = eu_radial_t.radial;
            } while(eu_radial_t != eu);
        }
    }

    for(let edge of visitedEdges) {
        edge.visited = false;
    }
    
    return intersections;
}

function triangulateModel(model: Model) {
    let region_t = model.region;
    let first_region = model.region;

    // Deixando todas as faces trianguladas
    do {
        if (region_t.id == 1) break;
        let shell_t = region_t.shell;

        const first_fu = shell_t.faceuse;
        let fu_t = shell_t.faceuse;
        
        do {
            const first_eu = fu_t.loopuse.edgeuse;
            let eu_t = fu_t.loopuse.edgeuse;
            
            let poly: Point[] = [];
            let vertices: Vertex[] = [];
            do {
                const p = eu_t.vertexUse.vertex.point;
                const v = eu_t.vertexUse.vertex;

                poly.push(p);
                vertices.push(v)
                eu_t = eu_t.clockwiseEdgeUse;
            } while (eu_t !== first_eu);

            const tris = Tesselation.tesselate3D(poly);

            for (let i = 0; i < tris.length - 1; i++) {
                const newFace = new Face();
                const newLoop = new Loop();
                const newEdge = new Edge();

                let edges: Edge[] = [];
                let vertexStart = vertices[tris[i][2]];
                let vertexInter = vertices[tris[i][1]];
                let vertexEnd = vertices[tris[i][0]];
                do {
                    if (eu_t.vertexUse.vertex == vertexStart) {
                        edges.push(eu_t.counterClockwiseEdgeUse.edge);
                    }

                    if (eu_t.vertexUse.vertex == vertexEnd) {
                        edges.push(eu_t.edge);
                    }

                    eu_t = eu_t.clockwiseEdgeUse;
                } while (eu_t !== first_eu);
                const mme = new MME(vertexStart, edges[0], Direction.CW, vertexEnd, edges[1], Direction.CCW, fu_t.face, Orientation.OUTSIDE, newEdge, newFace, newLoop);
                mme.execute();
            }

            fu_t = fu_t.next;
        } while (fu_t !== first_fu);

        region_t = region_t.next;
    } while (region_t !== first_region);
}

function drawModel(model: Model, color: number) {
    let region_t = model.region;
    let first_region = model.region;

    do {
        if (region_t.id == 1) break;
        let shell_t = region_t.shell;

        const first_fu = shell_t.faceuse;
        let fu_t = shell_t.faceuse;

        do {
            const first_eu = fu_t.loopuse.edgeuse;
            let eu_t = fu_t.loopuse.edgeuse;
            
            let points: Point[] = [];
            let points_three: THREE.Vector3[] = [];
            let i = 1;
            do {
                const p = eu_t.vertexUse.vertex.point;
                // const v = eu_t.vertexUse.vertex;

                // DRAW THREEJS
                points_three.push(new THREE.Vector3(p.x, p.y, p.z))
                
                points.push(p)
                eu_t = eu_t.clockwiseEdgeUse;
            } while (eu_t !== first_eu);

            points_three.push(points_three[0]);

            if (i == 1) {
                const geometry = new THREE.BufferGeometry();
                geometry.setFromPoints(points_three);
                const material = new THREE.MeshBasicMaterial({color});
                const poly = new THREE.Line(geometry, material);
                scene.add(poly);
            }
            i++;

            fu_t = fu_t.next;
        } while (fu_t !== first_fu);

        region_t = region_t.next;
    } while (region_t !== first_region);
}

function intersectModel(model: Model, rtree: RTree) {
    let region_t = model.region;
    let first_region = model.region;
    const intersections: Point[] = [];

    do {
        if (region_t.shell.faceuse.mate == first_region.shell.faceuse) break;
        let shell_t = region_t.shell;

        const first_fu = shell_t.faceuse;
        let fu_t = shell_t.faceuse;
        do {
            // console.log(fu_t.face.id);

            // setTimeout(()=>{}, 1000);

            const points = fu_t.face.getFaceOuterVertices();
            
            // searchIntersections(fu_t.face, model2.region.shell.faceuse.face)
            const tri = new Triangle(points[0], points[1], points[2]);
            // triangles.push(tri);
            rtree.intersect(tri, (node) => {
                    for (let f of node.children) {
                        const i = searchIntersections(fu_t.face, f as Face);
                        
                        // const j = searchIntersections(f as Face, fu_t.face);

                        intersections.push(...i);
                        // intersections.push(...j);
                    }
                },()=>{});

            fu_t = fu_t.next;
        } while (fu_t !== first_fu);

        region_t = region_t.next;
    } while (region_t !== first_region);

    intersections.forEach(intersection => {
        if (intersection) {
            const dotGeometry = new THREE.BufferGeometry();
            dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([intersection.x, intersection.y, intersection.z]), 3));
            const dotMaterial = new THREE.PointsMaterial({ size: 0.01, color: 0xffffff });
            const dot = new THREE.Points(dotGeometry, dotMaterial);
            scene.add(dot);        
        }
    });

    console.log(intersections);

    return intersections;
}

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.001, 1000);
camera.position.set(2, 2, 2);
camera.lookAt(5, 5, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new ArcballControls(camera, renderer.domElement);
controls.update();

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Função para ler .obj e criar triângulos
function readObjFile(fileContent: string): Triangle[] {
    const lines = fileContent.split('\n');
    const vertices: Point[] = [];
    const triangles: Triangle[] = [];

    for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (parts[0] === 'v') {
            // Vertices
            const x = parseFloat(parts[1]);
            const y = parseFloat(parts[2]);
            const z = parseFloat(parts[3]);
            vertices.push(new Point(x, y, z));
        } else if (parts[0] === 'f') {
            // Faces
            const v1 = vertices[parseInt(parts[1]) - 1];
            const v2 = vertices[parseInt(parts[2]) - 1];
            const v3 = vertices[parseInt(parts[3]) - 1];
            triangles.push(new Triangle(v1, v2, v3));
        }
    }

    return triangles;
}

// Percorre a RTree e desenha as bounding boxes dos nós
function renderRTreeBoundingBoxes(rtree: RTree) {
    const stack = [rtree.root];

    while (stack.length > 0) {
        const node = stack.pop();
        if (!node) continue;
        // Cor diferente para folha e intermediário
        const color = node.isLeaf ? 0x0000ff : 0x0000ff;
        if(node.isLeaf) {
            drawBoundingBox(node.bbox, color);
        }
        if (!node.isLeaf) {
            for (const child of node.children) {
                // Só empilha se for nó (não GeoObject)
                if (child instanceof Node) {
                    stack.push(child);
                }
            }
        }
    }
}

let bboxMesh: THREE.Line;
let boxes: THREE.Line[] = [];

// Função para desenhar uma bounding box
function drawBoundingBox(bbox: BoundingBox, color: number, removePrevious: boolean = true) {
    if(removePrevious) {
        scene.remove(bboxMesh);
        if (boxes.length) {
            for(let child of boxes) {
                scene.remove(child);
            }
            boxes = []
        }
    }

    const min = bbox.expandedBbox().min;
    const max = bbox.expandedBbox().max;
    const vertices = [
        [min.x, min.y, min.z], [max.x, min.y, min.z],
        [max.x, max.y, min.z], [min.x, max.y, min.z],
        [min.x, min.y, max.z], [max.x, min.y, max.z],
        [max.x, max.y, max.z], [min.x, max.y, max.z]
    ];
    const edges = [
        [0,1],[1,2],[2,3],[3,0], // base
        [4,5],[5,6],[6,7],[7,4], // topo
        [0,4],[1,5],[2,6],[3,7]  // laterais
    ];
    const geometry = new THREE.BufferGeometry();
    const points: THREE.Vector3[] = [];
    edges.forEach(([i, j]) => {
        points.push(new THREE.Vector3(vertices[i][0], vertices[i][1], vertices[i][2]));
        points.push(new THREE.Vector3(vertices[j][0], vertices[j][1], vertices[j][2]));
    });
    geometry.setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color });

    if(removePrevious) {
        bboxMesh = new THREE.Line(geometry, material);
        scene.add(bboxMesh);

    } else {
        const line = new THREE.Line(geometry, material);
        boxes.push(line);
        scene.add(line);
    }
}

const rtree = new RTree(5);
// const mesh1: Triangle[] = readObjFile(plane);

// mesh1.forEach(triangle => {
//     rtree.insert(triangle);
// });

// mesh1.forEach(tri => {
//     const geometry = new THREE.BufferGeometry();
//     const points = [] as any[];
//     points.push(new THREE.Vector3(tri.a.x, tri.a.y, tri.a.z));
//     points.push(new THREE.Vector3(tri.b.x, tri.b.y, tri.b.z));
//     points.push(new THREE.Vector3(tri.c.x, tri.c.y, tri.c.z));
//     points.push(new THREE.Vector3(tri.a.x, tri.a.y, tri.a.z));
//     geometry.setFromPoints(points);
    
//     const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//     const line = new THREE.Line(geometry, material);
//     scene.add(line);
// });

const model = new Model();
const region = new Region();
const mmr = new MMR(model, region);

mmr.execute();

Cube.generate(region, new Point(0, 0, 0), 1, 1, 1);

const model2 = new Model();
const region2 = new Region();
const mmr2 = new MMR(model2, region2);

mmr2.execute();

Cube.generate(region2, new Point(0.5, 0.5, 0.5), 1, 1, 1);

triangulateModel(model);
triangulateModel(model2);

drawModel(model, 0xff0000);
drawModel(model2, 0x0000ff);
rtree.buildFromModel(model2);

// renderRTreeBoundingBoxes(rtree);
// const intersections = intersectModel(model, rtree);

// console.log(curve);

// mesh1.forEach(tri => {
//     const geometry = new THREE.BufferGeometry();
//     const points = [] as any[];
//     points.push(new THREE.Vector3(tri.a.x, tri.a.y, tri.a.z));
//     points.push(new THREE.Vector3(tri.b.x, tri.b.y, tri.b.z));
//     points.push(new THREE.Vector3(tri.c.x, tri.c.y, tri.c.z));
//     points.push(new THREE.Vector3(tri.a.x, tri.a.y, tri.a.z));
//     geometry.setFromPoints(points);
    
//     const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
//     const line = new THREE.Line(geometry, material);
//     scene.add(line);
// });

// for (let i = 0; i < curve.length; i++) {
//     const geometry = new THREE.BufferGeometry();
//     const points = [] as any[];
//     // console.log(curve[i])
//     // console.log(curve[(i+1) % curve.length])
//     points.push(new THREE.Vector3(curve[i].x, curve[i].y, curve[i].z));
//     points.push(new THREE.Vector3(curve[(i +1) % curve.length].x, curve[(i+1) % curve.length].y, curve[(i+1) % curve.length].z));
//     geometry.setFromPoints(points);
    
//     const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
//     const line = new THREE.Line(geometry, material);
//     scene.add(line);
// }

// const io = new OBJFileIO(model);
// io.write("examples/triangulated.obj")
let eu: EdgeUse = model.region.shell.faceuse.loopuse.edgeuse;
let first_eu: EdgeUse = model.region.shell.faceuse.loopuse.edgeuse;
let faceGroup: THREE.Line[] = [];

const faces_queue: {face1: Face, face2: Face}[] = [];

let region_t = model.region;
let first_region = model.region;

do {
    if (region_t.shell.faceuse.mate == first_region.shell.faceuse) break;
    let shell_t = region_t.shell;

    const first_fu = shell_t.faceuse;
    let fu_t = shell_t.faceuse;
    do {
        const points = fu_t.face.getFaceOuterVertices();
        
        // searchIntersections(fu_t.face, model2.region.shell.faceuse.face)
        const tri = new Triangle(points[0], points[1], points[2]);
        // triangles.push(tri);
        rtree.intersect(tri, (node) => {
                for (let f of node.children) {
                    faces_queue.push({face1: fu_t.face, face2: f as Face})
                }
            },()=>{});

        fu_t = fu_t.next;
    } while (fu_t !== first_fu);

    region_t = region_t.next;
} while (region_t !== first_region);

function searchIntersectionsInteractive(triangleA: Face, triangleB: Face) {
    if (facesVisitedList.find(({face1, face2}) => (face1 == triangleA && face2 == triangleB) || (face1 == triangleB && face2 == triangleA))) {
        console.log("found")
        return
    };
    
    // console.log(facesVisitedList.length);
    facesVisitedList.push({face1: triangleA, face2: triangleB});

    const intersections: Point[] = []

    let eu_t = triangleA.faceuse.loopuse.edgeuse;
    const first_eu = triangleA.faceuse.loopuse.edgeuse;

    // const pOfA = boundaryPointsOfFace(triangleA);
    
    const visitedEdges: Edge[] = [];
    // const queue: EdgeUse[] = [];
    const queue_edge_tri: {eu: EdgeUse, face: Face}[] = [];

    // Add all face's edges to queue
    do {
        // queue.push(eu_t);
        queue_edge_tri.push({eu: eu_t, face: triangleB});

        eu_t = eu_t.counterClockwiseEdgeUse;
    } while (eu_t != first_eu);

    let eu_tB = triangleB.faceuse.loopuse.edgeuse;
    const first_euB = triangleB.faceuse.loopuse.edgeuse;

    // Add all face's edges to queue
    do {
        // queue.push(eu_t);
        queue_edge_tri.push({eu: eu_tB, face: triangleA});

        eu_tB = eu_tB.counterClockwiseEdgeUse;
    } while (eu_tB != first_euB);

    while(queue_edge_tri.length > 0) {
        const {eu, face} = queue_edge_tri.pop();

        // console.log(queue_edge_tri.length);

        if (edgesfacesVisitedList.find(({edge, face: f}) => (edge == eu.edge && f == face))) {
            console.log("found");
            continue;
        };

        if (eu.edge.visited) {
            console.log("edge visited");
            continue;
        };

        edgesfacesVisitedList.push({edge: eu.edge, face})

        const line = new Line(eu.vertexUse.vertex.point, eu.mate.vertexUse.vertex.point);

        const pOfT = face.getFaceOuterVertices();
        // const pOfB = triangleB.getFaceOuterVertices();
        const tri = new Triangle(pOfT[0], pOfT[1], pOfT[2]);
        // const tB = new Triangle(pOfB[0], pOfB[1], pOfB[2]);
 
        const intersection = Intersection.segmentTriangleIntersectionExact(line, tri);
        
        eu.edge.visited = true;
        visitedEdges.push(eu.edge);

        if(intersection) {
            intersections.push(intersection);
            curve.push(intersection);

            // curve.push(intersection);

            // Add all neighbours faces' edgeuses to queue
            // Making it traverse through neighbours is causing duplicates intersections
            let eu_radial_t = eu.radial;
            do {
                let eu_face_t = eu_radial_t;
                const first_eu_face_t = eu_face_t;
                
                do {
                    // queue_edge_tri.push({eu: eu_face_t, face});
                    faces_queue.push({face1: eu_face_t.loopuse.faceuse.face, face2: face});
                    eu_face_t = eu_face_t.counterClockwiseEdgeUse;
                } while (eu_face_t != first_eu_face_t)

                eu_radial_t = eu_radial_t.radial;
            } while(eu_radial_t != eu);
        }
    }

    for(let edge of visitedEdges) {
        edge.visited = false;
    }
    
    return intersections;
}

const lines: THREE.Line[] = []
let curveLine: THREE.Line;
let i = 0;
document.addEventListener('keydown', (ev) => {
    if(ev.key == "a") {
        // if (faceGroup) scene.remove(faceGroup);
        for (let line of faceGroup) scene.remove(line);

        // eu.edge.visited = true;

        // if (eu.edge.visited) {
        //     eu = eu.counterClockwiseEdgeUse;
        //     const geometry = new THREE.BufferGeometry();
        //     const points = [] as any[];
        //     points.push(new THREE.Vector3(eu.vertexUse.vertex.point.x, eu.vertexUse.vertex.point.y, eu.vertexUse.vertex.point.z));
        //     points.push(new THREE.Vector3(eu.mate.vertexUse.vertex.point.x, eu.mate.vertexUse.vertex.point.y, eu.mate.vertexUse.vertex.point.z));
        //     geometry.setFromPoints(points);
            
        //     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        //     line = new THREE.Line(geometry, material);
        //     scene.add(line);

        //     return
        // }            

        let eu_t = eu;
        const eu_first = eu;
        do {
            const geometry = new THREE.BufferGeometry();
            const points = [] as any[];
            points.push(new THREE.Vector3(eu_t.vertexUse.vertex.point.x, eu_t.vertexUse.vertex.point.y, eu_t.vertexUse.vertex.point.z));
            points.push(new THREE.Vector3(eu_t.mate.vertexUse.vertex.point.x, eu_t.mate.vertexUse.vertex.point.y, eu_t.mate.vertexUse.vertex.point.z));
            geometry.setFromPoints(points);
            
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            faceGroup.push(line);

            eu_t = eu_t.counterClockwiseEdgeUse;
        } while (eu_t != eu_first)
        // scene.add(faceGroup);
        
        // if (eu.counterClockwiseEdgeUse == first_eu) {
        //     first_eu = eu.radial;
        //     eu = eu.clockwiseEdgeUse.radial.counterClockwiseEdgeUse;
        //     return;
        // }

        eu = eu.radial;
    } else if (ev.key == "i") {
        if (!faces_queue.length) return;
        const { face1, face2 } = faces_queue.pop();

        const pOfA = face1.getFaceOuterVertices();
        const pOfB = face2.getFaceOuterVertices();

        if(lines.length) {
            for (let l of lines) scene.remove(l);
        }

        {
            const geometry = new THREE.BufferGeometry();
            const points = [] as any[];
            points.push(new THREE.Vector3(pOfA[0].x, pOfA[0].y, pOfA[0].z));
            points.push(new THREE.Vector3(pOfA[1].x, pOfA[1].y, pOfA[1].z));
            points.push(new THREE.Vector3(pOfA[2].x, pOfA[2].y, pOfA[2].z));
            points.push(new THREE.Vector3(pOfA[0].x, pOfA[0].y, pOfA[0].z));
            geometry.setFromPoints(points);
            
            const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            lines.push(line);
        }

        {
            const geometry = new THREE.BufferGeometry();
            const points = [] as any[];
            points.push(new THREE.Vector3(pOfB[0].x, pOfB[0].y, pOfB[0].z));
            points.push(new THREE.Vector3(pOfB[1].x, pOfB[1].y, pOfB[1].z));
            points.push(new THREE.Vector3(pOfB[2].x, pOfB[2].y, pOfB[2].z));
            points.push(new THREE.Vector3(pOfB[0].x, pOfB[0].y, pOfB[0].z));
            geometry.setFromPoints(points);
            
            const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            lines.push(line);
        }

        const intersections = searchIntersectionsInteractive(face1, face2);

        
        console.log(curve.length)

        if (curve.length >= 2) {
            if(curveLine) scene.remove(curveLine);

            const geometry = new THREE.BufferGeometry();
            const points = [] as any[];
            for(let k = 0; k < curve.length - 1; k++) {
                points.push(curve[k]);
                points.push(curve[k + 1]);
            }
            geometry.setFromPoints(points);
            
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const line = new THREE.Line(geometry, material);
            scene.add(line);
            curveLine = line;
        }

        intersections?.forEach(intersection => {
        // if (intersection) {
                const dotGeometry = new THREE.BufferGeometry();
                dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([intersection.x, intersection.y, intersection.z]), 3));
                const dotMaterial = new THREE.PointsMaterial({ size: 0.01, color: 0xffffff });
                const dot = new THREE.Points(dotGeometry, dotMaterial);
                scene.add(dot);        
            // }
        });
    }
    // else if (ev.key == "s") {
    //     if (i > intersections.length) return;

    //     const dotGeometry = new THREE.BufferGeometry();
    //     dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([intersections[i].x, intersections[i].y, intersections[i].z]), 3));
    //     const dotMaterial = new THREE.PointsMaterial({ size: 0.1, color: 0xffff00 });
    //     const dot = new THREE.Points(dotGeometry, dotMaterial);
    //     scene.add(dot);

    //     i++;
    // }
});