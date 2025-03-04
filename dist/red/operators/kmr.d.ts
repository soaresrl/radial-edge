import Model from "../model";
import Region from "../region";
import Operator from "./operator";
export default class KMR extends Operator {
    private model?;
    private region?;
    constructor(model: Model, region: Region);
    execute(): void;
    unexecute(): void;
}
