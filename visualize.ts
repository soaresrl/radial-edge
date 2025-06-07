import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
 // Ajuste os imports conforme sua estrutura de build ou use um bundler
import Triangle from './geo/triangle';
import Point from './geo/point';
import RTree from './utils/rtree';
import GeoObject from './geo/object';
import Line from './geo/line';
import Intersection from './utils/intersection';

// Função para gerar um triângulo aleatório dentro de um cubo de tamanho 10
function randomTriangleLeft() {
    

    const randPoint = () => {
        let x: number;
        let y: number;
        let z: number;

        while(true) {
            x = Math.random() * 1000;
            y = Math.random() * 1000;
            z = Math.random() * 1000;

            if(x < 500 && y < 500 && z < 500){
                return new Point(x, y, z)
            }
        }
    }

    return new Triangle(randPoint(), randPoint(), randPoint());
}

function randomTriangleRight() {
    

    const randPoint = () => {
        let x: number;
        let y: number;
        let z: number;

        while(true) {
            x = Math.random() * 1000;
            y = Math.random() * 1000;
            z = Math.random() * 1000;

            if(x > 500 && y > 500 && z > 500){
                return new Point(x, y, z)
            }
        }
    }

    return new Triangle(randPoint(), randPoint(), randPoint());
}

// OBS: Verificar como fazer a inserção dos triângulos na RTREE para evitar interseção de nós
const meshSize = 500;
// Crie a RTree e insira triângulos aleatórios
const rtree = new RTree(10);
const mesh1: Triangle[] = [];
const mesh2: Triangle[] = [];
for (let i = 0; i < meshSize; i++) {
    const tri = i % 2 == 0 ? randomTriangleLeft() : randomTriangleRight();
    mesh1.push(tri);
    // rtree.insert(tri);
}

for (let i = 0; i < meshSize; i++) {
    const tri = randomTriangleLeft();
    mesh2.push(tri);
    // rtree.insert(tri);
}

// Three.js setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 10000);
camera.position.set(2000, 2000, 2000);
camera.lookAt(5, 5, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();
// // Adiciona linhas das bounding boxes dos triângulos
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
});

mesh2.forEach(tri => {
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
});

// Função para desenhar uma bounding box
function drawBoundingBox(bbox: any, color: number) {
    const min = bbox.min;
    const max = bbox.max;
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
    const line = new THREE.Line(geometry, material);
    scene.add(line);
}

function intersectWithRTree(): Point[] {
    // Monta RTree com os triângulos da primeira malha
    mesh1.forEach(triangle => {
        rtree.insert(triangle);
    });

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

        // Checar se triângulo choca com a bounding box de outros nós da RTree
        // rtree.traverse((node) => {
        //     if (node.isLeaf) {
        //         if(triangle.computeBoundingBox().intersects(node.bbox)){
        //             node.children.forEach((other) => {
        //                 if (other instanceof Triangle && other !== triangle) {
        //                     candidatePairs.push({ triangle1: other, triangle2: triangle });
        //                 }
        //             });
        //         }
        //     }
        // });
    });

    const intersections: Point[] = [];
    // Verifica interseção entre os triângulos candidatos
    candidatePairs.forEach(pair => {
        const intersections1 = [new Line(pair.triangle1.a, pair.triangle1.b),
            new Line(pair.triangle1.b, pair.triangle1.c), new Line(pair.triangle1.c, pair.triangle1.a)].map((segment) => {
                return Intersection.segmentTriangleIntersectionExact(segment, pair.triangle2);
            });

        const intersections2 = [new Line(pair.triangle2.a, pair.triangle2.b),
            new Line(pair.triangle2.b, pair.triangle2.c), new Line(pair.triangle2.c, pair.triangle2.a)].map((segment) => {
                return Intersection.segmentTriangleIntersectionExact(segment, pair.triangle1);
            });

        intersections.push(...intersections1.filter(p => p !== null));
        intersections.push(...intersections2.filter(p => p !== null));
    });

    // intersections.forEach(intersection => {
    //     if (intersection) {
    //         const dotGeometry = new THREE.BufferGeometry();
    //         dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([intersection.x, intersection.y, intersection.z]), 3));
    //         const dotMaterial = new THREE.PointsMaterial({ size: 10, color: 0xffffff });
    //         const dot = new THREE.Points(dotGeometry, dotMaterial);
    //         scene.add(dot);
    //     }
    // });

    return intersections;
}

function intersectNaive() {
    for (const triangle of mesh1) {
        for (const otherTriangle of mesh2) {
            if (triangle !== otherTriangle) {
                const segment1 = new Line(triangle.a, triangle.b);
                const segment2 = new Line(triangle.b, triangle.c);
                const segment3 = new Line(triangle.c, triangle.a);

                const intersection1 = Intersection.segmentTriangleIntersectionExact(segment1, otherTriangle);
                const intersection2 = Intersection.segmentTriangleIntersectionExact(segment2, otherTriangle);
                const intersection3 = Intersection.segmentTriangleIntersectionExact(segment3, otherTriangle);

                // if (intersection1) {
                //     const dotGeometry = new THREE.BufferGeometry();
                //     dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([intersection1.x, intersection1.y, intersection1.z]), 3));
                //     const dotMaterial = new THREE.PointsMaterial({ size: 10, color: 0xffffff });
                //     const dot = new THREE.Points(dotGeometry, dotMaterial);
                //     scene.add(dot);
                // }

                // if (intersection2) {
                //     const dotGeometry = new THREE.BufferGeometry();
                //     dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([intersection2.x, intersection2.y, intersection2.z]), 3));
                //     const dotMaterial = new THREE.PointsMaterial({ size: 10, color: 0xffffff });
                //     const dot = new THREE.Points(dotGeometry, dotMaterial);
                //     scene.add(dot);
                // }

                // if (intersection3) {
                //     const dotGeometry = new THREE.BufferGeometry();
                //     dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([intersection3.x, intersection3.y, intersection3.z]), 3));
                //     const dotMaterial = new THREE.PointsMaterial({ size: 10, color: 0xffffff });
                //     const dot = new THREE.Points(dotGeometry, dotMaterial);
                //     scene.add(dot);
                // }
            }
        }
    }
}

// Percorre a RTree e desenha as bounding boxes dos nós
function renderRTreeBoundingBoxes(rtree: RTree) {
    const stack = [rtree.root];

    while (stack.length > 0) {
        const node = stack.pop();
        if (!node) continue;
        // Cor diferente para folha e intermediário
        const color = node.isLeaf ? 0x00ff00 : 0x0000ff;
        if(node.isLeaf) {
            drawBoundingBox(node.bbox, color);

            // Faz interseção dos segmentos de um triangulo com outros triângulos do nó da RTree
            
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

// Monta a RTree e realiza a interseção

console.time('RTree Intersection')
const intersections = intersectWithRTree();
console.timeEnd('RTree Intersection');

console.time('Naive Intersection');
intersectNaive();
console.timeEnd('Naive Intersection');

// Renderiza os pontos de interseção
intersections.forEach(intersection => {
    if (intersection) {
        const dotGeometry = new THREE.BufferGeometry();
        dotGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array([intersection.x, intersection.y, intersection.z]), 3));
        const dotMaterial = new THREE.PointsMaterial({ size: 10, color: 0xffffff });
        const dot = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(dot);
    }
});


// Renderize as bounding boxes dos nós da RTree
// renderRTreeBoundingBoxes(rtree);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();