import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ArcballControls } from 'three/examples/jsm/controls/ArcballControls';
 // Ajuste os imports conforme sua estrutura de build ou use um bundler
import Triangle from './geo/triangle';
import Point from './geo/point';
import RTree, { Node } from './utils/rtree';
import GeoObject from './geo/object';
import Line from './geo/line';
import Intersection from './utils/intersection';
import { plane, hemisphere, wave } from './examples/meshes/superfie_1';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';
import BoundingBox from './utils/bbox';

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

// Função para gerar um triângulo aleatório dentro de um cubo de tamanho 10
// function randomTriangleLeft() {
    

//     const randPoint = () => {
//         let x: number;
//         let y: number;
//         let z: number;

//         while(true) {
//             x = Math.random() * 1000;
//             y = Math.random() * 1000;
//             z = Math.random() * 1000;

//             if(x < 500 && y < 500 && z < 500){
//                 return new Point(x, y, z)
//             }
//         }
//     }

//     return new Triangle(randPoint(), randPoint(), randPoint());
// }

// function randomTriangleRight() {
//     const randPoint = () => {
//         let x: number;
//         let y: number;
//         let z: number;

//         while(true) {
//             x = Math.random() * 1000;
//             y = Math.random() * 1000;
//             z = Math.random() * 1000;

//             if(x > 500 && y > 500 && z > 500){
//                 return new Point(x, y, z)
//             }
//         }
//     }

//     return new Triangle(randPoint(), randPoint(), randPoint());
// }

// OBS: Verificar como fazer a inserção dos triângulos na RTREE para evitar interseção de nós
// const meshSize = 500;
// Crie a RTree e insira triângulos aleatórios
const rtree = new RTree(5);
const mesh1: Triangle[] = readObjFile(plane)
const mesh2: Triangle[] = readObjFile(hemisphere);
// for (let i = 0; i < meshSize; i++) {
//     const tri = i % 2 == 0 ? randomTriangleLeft() : randomTriangleRight();
//     mesh1.push(tri);
//     // rtree.insert(tri);
// }

// for (let i = 0; i < meshSize; i++) {
//     const tri = randomTriangleLeft();
//     mesh2.push(tri);
//     // rtree.insert(tri);
// }

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 2);
camera.lookAt(5, 5, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new ArcballControls(camera, renderer.domElement);
controls.update();
// Adiciona linhas das bounding boxes dos triângulos
mesh1.forEach(tri => {
    const geometry = new THREE.BufferGeometry();
    // const geometry = new THREE.BoxGeometry(10, 10, 10);
    const points = [] as any[];
    points.push(new THREE.Vector3(tri.a.x, tri.a.y, tri.a.z));
    points.push(new THREE.Vector3(tri.b.x, tri.b.y, tri.b.z));
    points.push(new THREE.Vector3(tri.c.x, tri.c.y, tri.c.z));
    points.push(new THREE.Vector3(tri.a.x, tri.a.y, tri.a.z));
    geometry.setFromPoints(points);
    
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const line = new THREE.Line(geometry, material);
    // const box = new THREE.Mesh(geometry, material)
    scene.add(line);

    
    // [tri.a, tri.b, tri.c].forEach((p)=>{
    //     if (p.z === 0.0) {
            
    //         const dotGeometry = new THREE.BufferGeometry();
    //         dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([p.x, p.y, p.z]), 3));
    //         const dotMaterial = new THREE.PointsMaterial({ size: 0.01, color: 0xffff00 });
    //         const dot = new THREE.Points(dotGeometry, dotMaterial);
    //         scene.add(dot); 
    //     }
    // })
});

mesh1.forEach(triangle => {
    rtree.insert(triangle);
});

// mesh2.forEach(tri => {
//     const geometry = new THREE.BufferGeometry();
//     // const geometry = new THREE.BoxGeometry(10, 10, 10);
//     const points = [] as any[];
//     points.push(new THREE.Vector3(tri.a.x, tri.a.y, tri.a.z));
//     points.push(new THREE.Vector3(tri.b.x, tri.b.y, tri.b.z));
//     points.push(new THREE.Vector3(tri.c.x, tri.c.y, tri.c.z));
//     points.push(new THREE.Vector3(tri.a.x, tri.a.y, tri.a.z));
//     geometry.setFromPoints(points);
    
//     const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//     const line = new THREE.Line(geometry, material);
//     // const box = new THREE.Mesh(geometry, material)
//     scene.add(line);     
// });

let bboxMesh: THREE.Line;

// Função para desenhar uma bounding box
function drawBoundingBox(bbox: BoundingBox, color: number, removePrevious: boolean = true) {
    if(removePrevious) scene.remove(bboxMesh);

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
        scene.add(line);
    }

}

function intersectWithRTree(): Point[] {
    // Monta RTree com os triângulos da primeira malha
    // mesh1.forEach(triangle => {
    //     rtree.insert(triangle);
    // });

    const candidatePairs: Array<{ triangle1: Triangle, triangle2: Triangle }> = [];
    // Percorre os triângulos da segunda malha e verifica interseção com a RTree
    mesh2.forEach(triangle => {
        // const node = rtree.insert(triangle, false);
        // node.children.forEach((other) => {
        //     if (other instanceof Triangle) {
        //         candidatePairs.push({ triangle1: other, triangle2: triangle });
        //     }
        // });

        // Checar se triângulo choca com a bounding box de outros nós da RTree
        // rtree.traverse((node) => {
        //     if (node.isLeaf) {
        //         if(node.bbox.triangleIntersects(triangle)) {
        //             node.children.forEach((other) => {
        //                 if (other instanceof Triangle && other !== triangle) {
        //                     candidatePairs.push({ triangle1: other, triangle2: triangle });
        //                 }
        //             });
        //         }
        //     }
        // });

        rtree.intersect(triangle, (node) => {
            node.children.forEach((other) => {
                if (other instanceof Triangle) {
                    candidatePairs.push({ triangle1: other, triangle2: triangle });
                }
            });
        },()=>{});
    });

    const intersections: Point[] = [];
    // Verifica interseção entre os triângulos candidatos
    candidatePairs.forEach(pair => {
        const segment1 = new Line(pair.triangle1.a, pair.triangle1.b);
        const segment2 = new Line(pair.triangle1.b, pair.triangle1.c);
        const segment3 = new Line(pair.triangle1.c, pair.triangle1.a);
        const intersection1 = Intersection.segmentTriangleIntersectionExact(segment1, pair.triangle2);
        const intersection2 = Intersection.segmentTriangleIntersectionExact(segment2, pair.triangle2);
        const intersection3 = Intersection.segmentTriangleIntersectionExact(segment3, pair.triangle2);
        if (intersection1) intersections.push(intersection1);
        if (intersection2) intersections.push(intersection2);
        if (intersection3) intersections.push(intersection3);

        // Verifica se o triângulo 2 também intersecta o triângulo 1
        const segment4 = new Line(pair.triangle2.a, pair.triangle2.b);
        const segment5 = new Line(pair.triangle2.b, pair.triangle2.c);
        const segment6 = new Line(pair.triangle2.c, pair.triangle2.a);
        const intersection4 = Intersection.segmentTriangleIntersectionExact(segment4, pair.triangle1);
        const intersection5 = Intersection.segmentTriangleIntersectionExact(segment5, pair.triangle1);
        const intersection6 = Intersection.segmentTriangleIntersectionExact(segment6, pair.triangle1);
        if (intersection4) intersections.push(intersection4);
        if (intersection5) intersections.push(intersection5);
        if (intersection6) intersections.push(intersection6);
    });
    
    console.log('Candidatos encontrados:', candidatePairs.length);

    return intersections;
}

function intersectWithRTreeStepByStep(triangle: Triangle) {
    // Monta RTree com os triângulos da primeira malha
    // mesh1.forEach(triangle => {
    //     rtree.insert(triangle);
    // });

    const candidatePairs: Array<{ triangle1: Triangle, triangle2: Triangle }> = [];

    const boxes: Node[] = [];

    // Percorre os triângulos da segunda malha e verifica interseção com a RTree
    rtree.intersect(triangle, (node) => {
        // node.children.forEach((other) => {
        //     if (other instanceof Triangle) {
        //         candidatePairs.push({ triangle1: other, triangle2: triangle });
        //     }
        // });
        boxes.push(node);
    }, (bbox, isLeaf) => {
        // drawBoundingBox(bbox, isLeaf ? 0x0000ff : 0xffff00);
        drawBoundingBox(triangle.computeBoundingBox(), 0x00ff00, false)

        const geometry = new THREE.BufferGeometry();
        // const geometry = new THREE.BoxGeometry(10, 10, 10);
        const points = [] as any[];
        points.push(new THREE.Vector3(triangle.a.x, triangle.a.y, triangle.a.z));
        points.push(new THREE.Vector3(triangle.b.x, triangle.b.y, triangle.b.z));
        points.push(new THREE.Vector3(triangle.c.x, triangle.c.y, triangle.c.z));
        points.push(new THREE.Vector3(triangle.a.x, triangle.a.y, triangle.a.z));
        geometry.setFromPoints(points);
        
        const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        const line = new THREE.Line(geometry, material);
        // const box = new THREE.Mesh(geometry, material)
        scene.add(line); 
    });

    const intersections: Point[] = [];
    // Verifica interseção entre os triângulos candidatos
    candidatePairs.forEach(pair => {
        const segment1 = new Line(pair.triangle1.a, pair.triangle1.b);
        const segment2 = new Line(pair.triangle1.b, pair.triangle1.c);
        const segment3 = new Line(pair.triangle1.c, pair.triangle1.a);
        const intersection1 = Intersection.segmentTriangleIntersectionExact(segment1, pair.triangle2);
        const intersection2 = Intersection.segmentTriangleIntersectionExact(segment2, pair.triangle2);
        const intersection3 = Intersection.segmentTriangleIntersectionExact(segment3, pair.triangle2);
        if (intersection1) intersections.push(intersection1);
        if (intersection2) intersections.push(intersection2);
        if (intersection3) intersections.push(intersection3);

        // Verifica se o triângulo 2 também intersecta o triângulo 1
        const segment4 = new Line(pair.triangle2.a, pair.triangle2.b);
        const segment5 = new Line(pair.triangle2.b, pair.triangle2.c);
        const segment6 = new Line(pair.triangle2.c, pair.triangle2.a);
        const intersection4 = Intersection.segmentTriangleIntersectionExact(segment4, pair.triangle1);
        const intersection5 = Intersection.segmentTriangleIntersectionExact(segment5, pair.triangle1);
        const intersection6 = Intersection.segmentTriangleIntersectionExact(segment6, pair.triangle1);
        if (intersection4) intersections.push(intersection4);
        if (intersection5) intersections.push(intersection5);
        if (intersection6) intersections.push(intersection6);
    });

    boxes.forEach((node)=>{
        drawBoundingBox(node.bbox, 0x0000ff, false);

        node.children.forEach((tri) => {
            if (tri instanceof Triangle) {
                const geometry = new THREE.BufferGeometry();
                // const geometry = new THREE.BoxGeometry(10, 10, 10);
                const points = [] as any[];
                points.push(new THREE.Vector3(tri.a.x, tri.a.y, tri.a.z));
                points.push(new THREE.Vector3(tri.b.x, tri.b.y, tri.b.z));
                points.push(new THREE.Vector3(tri.c.x, tri.c.y, tri.c.z));
                points.push(new THREE.Vector3(tri.a.x, tri.a.y, tri.a.z));
                geometry.setFromPoints(points);
                
                const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
                const line = new THREE.Line(geometry, material);
                // const box = new THREE.Mesh(geometry, material)
                scene.add(line); 
            }
        })
    })
    
    // console.log('Candidatos encontrados:', candidatePairs.length);
    // console.log('Interseções encontradas:', intersections.length);

    return intersections;
}

function intersectNaive() {
    let intersections: Point[] = [];
    for (const triangle of mesh1) {
        for (const otherTriangle of mesh2) {
            if (triangle !== otherTriangle) {
                const segment1 = new Line(triangle.a, triangle.b);
                const segment2 = new Line(triangle.b, triangle.c);
                const segment3 = new Line(triangle.c, triangle.a);

                const intersection1 = Intersection.segmentTriangleIntersectionExact(segment1, otherTriangle);
                const intersection2 = Intersection.segmentTriangleIntersectionExact(segment2, otherTriangle);
                const intersection3 = Intersection.segmentTriangleIntersectionExact(segment3, otherTriangle);

                const segment4 = new Line(otherTriangle.a, otherTriangle.b);
                const segment5 = new Line(otherTriangle.b, otherTriangle.c);
                const segment6 = new Line(otherTriangle.c, otherTriangle.a);

                const intersection4 = Intersection.segmentTriangleIntersectionExact(segment4, triangle);
                const intersection5 = Intersection.segmentTriangleIntersectionExact(segment5, triangle);
                const intersection6 = Intersection.segmentTriangleIntersectionExact(segment6, triangle);

                intersections.push(intersection1, intersection2, intersection3);
                intersections.push(intersection4, intersection5, intersection6);
            }
        }
    }

    return intersections.filter(p => p !== null);
}

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

// Monta a RTree e realiza a interseção

console.time('RTree Intersection')
const intersections = intersectWithRTree();
console.timeEnd('RTree Intersection');

console.time('Naive Intersection');
const intersectionsNaive = intersectNaive();
console.timeEnd('Naive Intersection')

let i = 0;
document.addEventListener('keydown', (ev) => {
    if (ev.key == "a") {
        let tri = mesh2[i];
        intersectWithRTreeStepByStep(tri);
        i++;
    }
});

let linesGroup = new THREE.Group();
let trianglesGroup = new THREE.Group();
function showRtreeLeaves(node: Node) {
    console.log(node.children.length);
    drawBoundingBox(node.bbox, 0xff00ff, true);

    scene.remove(trianglesGroup);
    trianglesGroup.clear();
    linesGroup.clear();

    node.children.forEach((tri)=>{
        if (tri instanceof Triangle) {
            const geometry = new THREE.BufferGeometry();
            // const geometry = new THREE.BoxGeometry(10, 10, 10);
            const points = [] as any[];
            points.push(new THREE.Vector3(tri.a.x, tri.a.y, tri.a.z));
            points.push(new THREE.Vector3(tri.b.x, tri.b.y, tri.b.z));
            points.push(new THREE.Vector3(tri.c.x, tri.c.y, tri.c.z));
            points.push(new THREE.Vector3(tri.a.x, tri.a.y, tri.a.z));
            geometry.setFromPoints(points);
            
            const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            const line = new THREE.Line(geometry, material);
            // const box = new THREE.Mesh(geometry, material)
            linesGroup.add(line);
        }
        trianglesGroup.add(linesGroup);
    })

    scene.add(trianglesGroup);
}

let j = 0;
document.addEventListener('keydown', (ev) => {
    if (ev.key == "s") {
        showRtreeLeaves(rtree.leaves[j]);
        j++;

        if (j >= rtree.leaves.length) j = 0;
    }
});

console.log('Interseções encontradas (RTree):', intersections.length);
console.log('Interseções encontradas (naive):', intersectionsNaive.length);

// Percorre a RTree e desenha as bounding boxes dos nós
function renderRTreeBoundingBoxes(rtree: RTree) {
    const stack = [rtree.root];
    console.log("render rtree")

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
                if (child instanceof Object && 'isLeaf' in child) {
                    stack.push(child);
                }
            }
        }
    }
}

// Renderiza os pontos de interseção
// intersectionsNaive.forEach(intersection => {
//     if (intersection) {
//         const dotGeometry = new THREE.BufferGeometry();
//         dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([intersection.x, intersection.y, intersection.z]), 3));
//         const dotMaterial = new THREE.PointsMaterial({ size: 0.01, color: 0x0000ff });
//         const dot = new THREE.Points(dotGeometry, dotMaterial);
//         scene.add(dot);
//     }
// });


// Renderiza os pontos de interseção
intersections.forEach(intersection => {
    if (intersection) {
        const dotGeometry = new THREE.BufferGeometry();
        dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([intersection.x, intersection.y, intersection.z]), 3));
        const dotMaterial = new THREE.PointsMaterial({ size: 0.01, color: 0xffffff });
        const dot = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(dot);        
    }
});

// Renderize as bounding boxes dos nós da RTree
// renderRTreeBoundingBoxes(rtree);