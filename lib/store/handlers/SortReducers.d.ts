import { Column } from "../../models/ColumnLike";
import { GigaAction } from "../GigaStore";
import { GigaState } from "../../components/GigaState";
export declare function sortUpdateHandler(state: GigaState, action: SortUpdateAction): GigaState;
export declare function cleartSortHandler(state: GigaState): GigaState;
export interface ClearSortAction extends GigaAction {
}
export interface SortUpdateAction extends GigaAction {
    sortBys: Column[];
}
