/// <reference types="react" />
import { Row } from "../../models/Row";
import { TableBody } from "./TableBody";
export declare class FrozenTableBody extends TableBody {
    mapRowsInBody(rowHeight: string, row: Row, i: number): JSX.Element;
}
