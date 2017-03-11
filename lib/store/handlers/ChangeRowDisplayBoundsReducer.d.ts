import { GigaState } from "../../components/GigaGrid";
import { GigaAction } from "../GigaStore";
export declare function changeDisplayBoundsHandler(state: GigaState, action: ChangeRowDisplayBoundsAction): {} & GigaState;
export interface ChangeRowDisplayBoundsAction extends GigaAction {
    viewport: any;
    canvas: any;
    rowHeight: string;
    bodyHeight: string;
}
