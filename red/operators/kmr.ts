import Model from "../model";
import Region from "../region";
import MMR from "./mmr";
import Operator from "./operator";

export default class KMR extends Operator {
    private model?: Model;
    private region?: Region;

    constructor(model: Model, region: Region){
        super();
        
        this.model = model;
        this.region = region;
    }

    public execute(){
        console.log("cannot execute KMR");
    }

    public unexecute(){
        const mmr = new MMR(this.model!, this.region!);

        mmr.execute();
    }
}