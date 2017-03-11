/// <reference types="react" />
import { TableBody } from "./TableBody";
import { Row } from "../../models/Row";
export declare class ScrollableTableBody extends TableBody {
    mapRowsInBody(rowHeight: string, row: Row, i: number): JSX.Element;
}
