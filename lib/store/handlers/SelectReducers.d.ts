/// <reference types="flux" />
import { GigaAction } from "../GigaStore";
import { Row } from "../../models/Row";
import { Column } from "../../models/ColumnLike";
import { GigaProps } from "../../components/GigaProps";
import { Dispatcher } from "flux";
import { GigaState } from "../../components/GigaState";
export declare function cellSelectHandler(state: GigaState, action: ToggleCellSelectAction, props: GigaProps, dispatcher: Dispatcher<any>): GigaState;
export declare function rowSelectHandler(state: GigaState, action: ToggleRowSelectAction, props: GigaProps): GigaState;
export interface ToggleRowSelectAction extends GigaAction {
    row: Row;
}
export interface ToggleCellSelectAction extends GigaAction {
    row: Row;
    column: Column;
}
