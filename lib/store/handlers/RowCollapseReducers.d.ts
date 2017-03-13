import { GigaAction } from "../GigaStore";
import { Row } from "../../models/Row";
import { GigaProps } from "../../components/GigaProps";
import { GigaState } from "../../components/GigaState";
export declare function expandAllHandler(state: GigaState): GigaState;
export declare function collapseAllHandler(state: GigaState): GigaState;
export declare function toggleCollapseHandler(state: GigaState, action: ToggleCollapseAction, props: GigaProps): GigaState;
export interface ToggleCollapseAction extends GigaAction {
    subtotalRow: Row;
}
