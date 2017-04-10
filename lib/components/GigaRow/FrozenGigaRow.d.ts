/// <reference types="react" />
import { GigaRow } from "./GigaRow";
import { Column } from "../../models/ColumnLike";
import { CellProps, Cell } from "../Cell/Cell";
import { ClassAttributes } from "react";
/**
 * a row in the freeze pane section of the table
 */
export declare class FrozenGigaRow extends GigaRow {
    getCellProps(column: Column, i: number): CellProps & ClassAttributes<Cell>;
}
