import { GigaAction } from "../GigaStore";
import { Row } from "../../models/Row";
import { Column } from "../../models/ColumnLike";
import { GigaState } from "../../components/GigaState";
export declare function cellContentChangeHandler(state: GigaState, action: CellContentChangeAction): {} & GigaState;
export interface CellContentChangeAction extends GigaAction {
    row: Row;
    column: Column;
    newContent: any;
}
