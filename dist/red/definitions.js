"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Direction = exports.Orientation = exports.DescType = void 0;
var DescType;
(function (DescType) {
    DescType[DescType["MODEL"] = 0] = "MODEL";
    DescType[DescType["REGION"] = 1] = "REGION";
    DescType[DescType["SHELL"] = 2] = "SHELL";
    DescType[DescType["FACE"] = 3] = "FACE";
    DescType[DescType["LOOP"] = 4] = "LOOP";
    DescType[DescType["EDGE"] = 5] = "EDGE";
    DescType[DescType["VERTEX"] = 6] = "VERTEX";
    DescType[DescType["FACEUSE"] = 7] = "FACEUSE";
    DescType[DescType["LOOPUSE"] = 8] = "LOOPUSE";
    DescType[DescType["EDGEUSE"] = 9] = "EDGEUSE";
    DescType[DescType["VERTEXUSE"] = 10] = "VERTEXUSE";
})(DescType || (exports.DescType = DescType = {}));
var Orientation;
(function (Orientation) {
    Orientation[Orientation["UNSPECIFIED"] = 0] = "UNSPECIFIED";
    Orientation[Orientation["SAME"] = 1] = "SAME";
    Orientation[Orientation["OPPOSITE"] = 2] = "OPPOSITE";
    Orientation[Orientation["INSIDE"] = 3] = "INSIDE";
    Orientation[Orientation["OUTSIDE"] = 4] = "OUTSIDE";
})(Orientation || (exports.Orientation = Orientation = {}));
var Direction;
(function (Direction) {
    Direction[Direction["UNSP"] = 0] = "UNSP";
    Direction[Direction["CW"] = 1] = "CW";
    Direction[Direction["CCW"] = 2] = "CCW";
})(Direction || (exports.Direction = Direction = {}));
//# sourceMappingURL=definitions.js.map