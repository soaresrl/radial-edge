import { DescType, QueryType } from "../definitions";
import FaceUse from "../faceuse";
import Shell from "../shell";

function red_g_fus(s: Shell, q_type: QueryType): FaceUse {
    let fu_t: FaceUse = null;

    if(s.desc_type == DescType.FACEUSE) {
        fu_t = s.faceuse.query(fu_t, q_type);
    } else {
        fu_t = null;
    }

    return fu_t;
}

export {
    red_g_fus
}