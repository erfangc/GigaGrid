import { GigaAction } from "../GigaStore";
import { Row } from "../../models/Row";
import { Column } from "../../models/ColumnLike";
import { GigaState } from "../../components/GigaGrid";

export function cellContentChangeHandler(state: GigaState, action: CellContentChangeAction) {
    const newState = Object.assign({}, state);
    let { row, column, newContent } = action;
    row.data[column.colTag] = newContent;
    return newState;
}

export interface CellContentChangeAction extends GigaAction {
    row: Row
    column: Column
    newContent: any
}