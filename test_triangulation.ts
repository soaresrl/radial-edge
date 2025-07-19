import { ArcballControls } from "three/examples/jsm/controls/ArcballControls";
import Point from "./geo/point";
import Tesselation from "./utils/tesselate";

import * as THREE from "three";

const p1 = new Point(0, 0, 0);
const p2 = new Point(1, 0, 0);
const p3 = new Point(2, 1, 0);
const p4 = new Point(1, 2, 0);
const p5 = new Point(0, 2, 0);
const p6 = new Point(-1, 1, 0);

const polygon = [p1, p2, p3, p4, p5, p6];

const geometry = new THREE.BufferGeometry()
geometry.setFromPoints([
    new THREE.Vector3(p1.x, p1.y, p1.z),
    new THREE.Vector3(p2.x, p2.y, p2.z),
    new THREE.Vector3(p3.x, p3.y, p3.z),
    new THREE.Vector3(p4.x, p4.y, p4.z),
    new THREE.Vector3(p5.x, p5.y, p5.z),
    new THREE.Vector3(p6.x, p6.y, p6.z),
    new THREE.Vector3(p1.x, p1.y, p1.z),
]);

const material = new THREE.MeshBasicMaterial({color: 0xff0000});

const poly = new THREE.Line(geometry, material);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
camera.position.set(2, 2, 2);
camera.lookAt(5, 5, 5);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new ArcballControls(camera, renderer.domElement);
controls.update();

scene.add(poly);

// Render loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}
animate();

const tris = Tesselation.tesselate3D(polygon);

console.log(tris)

for (let tri of tris) {
    const geometry = new THREE.BufferGeometry()
    geometry.setFromPoints([
        new THREE.Vector3(polygon[tri[0]].x, polygon[tri[0]].y, polygon[tri[0]].z),
        new THREE.Vector3(polygon[tri[1]].x, polygon[tri[1]].y, polygon[tri[1]].z),
        new THREE.Vector3(polygon[tri[2]].x, polygon[tri[2]].y, polygon[tri[2]].z),
        new THREE.Vector3(polygon[tri[0]].x, polygon[tri[0]].y, polygon[tri[0]].z),
    ]);

    const material = new THREE.MeshBasicMaterial({color: 0xff00ff});

    const poly = new THREE.Line(geometry, material);

    scene.add(poly)
}