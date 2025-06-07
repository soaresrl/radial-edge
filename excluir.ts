// static triangleTriangleIntersection (a: Triangle, b: Triangle) {
//         // Implement the Möller–Trumbore intersection algorithm
//         const edge1 = new THREE.Vector3().subVectors(b.b, b.a);
//         const edge2 = new THREE.Vector3().subVectors(b.c, b.a);
//         const h = new THREE.Vector3().crossVectors(a.direction, edge2);
//         const aDotH = a.direction.dot(h);

//         if (aDotH > -Number.EPSILON && aDotH < Number.EPSILON) {
//             return false; // Parallel
//         }

//         const f = 1 / aDotH;
//         const s = new THREE.Vector3().subVectors(a.origin, b.a);
//         const u = f * s.dot(h);

//         if (u < 0 || u > 1) {
//             return false; // Outside triangle
//         }

//         const q = new THREE.Vector3().crossVectors(s, edge1);
//         const v = f * a.direction.dot(q);

//         if (v < 0 || u + v > 1) {
//             return false; // Outside triangle
//         }

//         const t = f * edge2.dot(q);
//         return t > Number.EPSILON; // Intersection occurs
//     }