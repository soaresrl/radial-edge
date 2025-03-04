import Model from "../model";
import Region from "../region";
import KMR from "./kmr";
import Operator from "./operator";

export default class MMR extends Operator {
    private model: Model;
    private region: Region;

    constructor(model: Model, region: Region){
        super();

        this.model = model;
        this.region = region;
    }

    public execute(){
        this.model.region = this.region;
        
        this.region.model = this.model;
        this.region.next = this.region;
        this.region.last = this.region;
    }

    public unexecute(){
        console.log("cannot unexecute MMR");
    }
}