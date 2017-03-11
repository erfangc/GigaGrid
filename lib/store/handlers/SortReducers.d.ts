import { Column } from "../../models/ColumnLike";
import { GigaState } from "../../components/GigaGrid";
import { GigaAction } from "../GigaStore";
export declare function sortUpdateHandler(state: GigaState, action: SortUpdateAction): GigaState;
export declare function cleartSortHandler(state: GigaState): GigaState;
export interface ClearSortAction extends GigaAction {
}
export interface SortUpdateAction extends GigaAction {
    sortBys: Column[];
}
