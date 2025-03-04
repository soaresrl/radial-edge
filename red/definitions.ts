enum DescType {
    MODEL,
    REGION,
    SHELL,
    FACE,
    LOOP,
    EDGE,
    VERTEX,
    FACEUSE,
    LOOPUSE,
    EDGEUSE,
    VERTEXUSE
}

enum Orientation {
    UNSPECIFIED,
    SAME,
    OPPOSITE,
    INSIDE,
    OUTSIDE
}

enum Direction {
    UNSP,
    CW,
    CCW
}

interface Attribute {

}



export { DescType, Orientation, Direction, Attribute };