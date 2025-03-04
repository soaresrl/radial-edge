declare enum DescType {
    MODEL = 0,
    REGION = 1,
    SHELL = 2,
    FACE = 3,
    LOOP = 4,
    EDGE = 5,
    VERTEX = 6,
    FACEUSE = 7,
    LOOPUSE = 8,
    EDGEUSE = 9,
    VERTEXUSE = 10
}
declare enum Orientation {
    UNSPECIFIED = 0,
    SAME = 1,
    OPPOSITE = 2,
    INSIDE = 3,
    OUTSIDE = 4
}
declare enum Direction {
    UNSP = 0,
    CW = 1,
    CCW = 2
}
interface Attribute {
}
export { DescType, Orientation, Direction, Attribute };
