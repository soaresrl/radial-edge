import Line from "./geo/line";
import Point from "./geo/point";
import Triangle from "./geo/triangle";
import Intersection from "./utils/intersection";

const triangle = new Triangle(new Point(0, 0, 0), new Point(2, 0, 0), new Point(0, 2, 0));
const segment = new Line(new Point(0, 0, 1), new Point(0, 0, -1));

const result = Intersection.segmentTriangleIntersectionExact(segment, triangle);

console.log("Intersection result:", result);
// const result2 = Orient3D(0, 0, 0, 2, 0, 0, 0, 2, 0, 1, 1, 1);

// console.log("Orient3D result:", result2);
// console.log("Intersection parameters:");
// console.log("tp:", tp);
// console.log("up:", up);
// console.log("vp:", vp);



// const result1 = Orient3D(0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1);
// const result2 = Orient3D(0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, -1);

// console.log("Orient3D result:", result1);
// console.log("Orient3D result:", result2);