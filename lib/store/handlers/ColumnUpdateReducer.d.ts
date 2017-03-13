import { GigaAction } from "../GigaStore";
import { Column } from "../../models/ColumnLike";
import { GigaProps } from "../../components/GigaProps";
import { GigaState } from "../../components/GigaState";
export declare function columnUpdateHandler(state: GigaState, action: ColumnUpdateAction, props: GigaProps): {} & GigaState & {
    columns: Column[];
    subtotalBys: Column[];
    showSettingsPopover: boolean;
};
export interface ColumnUpdateAction extends GigaAction {
    columns: Column[];
    subtotalBys: Column[];
}
