/// <reference types="react" />
import { ClassAttributes } from "react";
import { GigaRow } from "./GigaRow";
import { Column } from "../../models/ColumnLike";
import { CellProps, Cell } from "../Cell/Cell";
export declare class ScrollableGigaRow extends GigaRow {
    getCellProps(column: Column, i: number): CellProps & ClassAttributes<Cell>;
}
