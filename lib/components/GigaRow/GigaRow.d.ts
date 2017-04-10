/// <reference types="react" />
import * as React from "react";
import { Row } from "../../models/Row";
import { Column } from "../../models/ColumnLike";
import { GridComponentProps } from "../GigaGrid";
import { CellProps } from "../Cell/Cell";
import { GigaProps } from "../GigaProps";
export interface GigaRowProps extends GridComponentProps<GigaRow> {
    row: Row;
    rowHeight: string;
    columns: Column[];
    staticLeftHeaders?: boolean;
    scrollableRightData?: boolean;
    gridProps: GigaProps;
}
export declare abstract class GigaRow extends React.Component<GigaRowProps, any> {
    constructor(props: GigaRowProps);
    protected generateCellKey(column: Column): string;
    render(): JSX.Element;
    rowSelect(e: React.MouseEvent<any>): void;
    /**
     * renders a cell given the cell's props
     */
    protected static renderCell(props: CellProps): JSX.Element;
    abstract getCellProps(column: Column, i: number): CellProps;
}
