/// <reference types="react" />
import * as React from "react";
import { Column } from "../../models/ColumnLike";
import { Row } from "../../models/Row";
import { GridComponentProps } from "../GigaGrid";
export interface TableBodyProps extends GridComponentProps<TableBody> {
    rows: Row[];
    columns: Column[];
    rowHeight?: string;
}
export declare class TableBody extends React.Component<TableBodyProps, any> {
    constructor(props: TableBodyProps);
    renderRows(rowHeight: string, start?: number, end?: number): JSX.Element[];
    mapRowsInBody(rowHeight: string, row: Row, i: number): JSX.Element;
    render(): JSX.Element;
}
