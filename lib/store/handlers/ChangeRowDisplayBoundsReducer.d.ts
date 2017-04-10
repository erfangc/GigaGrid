import { GigaAction } from "../GigaStore";
import { GigaState } from "../../components/GigaState";
export declare function changeDisplayBoundsHandler(state: GigaState, action: ChangeRowDisplayBoundsAction): {} & GigaState;
export interface ChangeRowDisplayBoundsAction extends GigaAction {
    rowHeight: string;
    bodyHeight: string;
}
