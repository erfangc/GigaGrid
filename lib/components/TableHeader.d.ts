/// <reference types="react" />
import * as React from "react";
import { Column } from "../models/ColumnLike";
import { GridComponentProps } from "./GigaGrid";
export interface TableHeaderProps extends GridComponentProps<TableHeader> {
    tableHeaderClass?: string;
    columns: Column[][];
    staticLeftHeaders: number;
}
/**
 * terminology: column groups are columns that can span multiple `leaf` columns and physically reside
 * on top of `leaf` columns
 *
 * `leaf` columns are the real columns that are associated with the cells in the table
 */
export declare class TableHeader extends React.Component<TableHeaderProps, any> {
    constructor(props: TableHeaderProps);
    render(): JSX.Element;
    private renderHeaderRows();
    private static renderColumnGroups(columns, key);
    private renderLeafColumns(columns, key);
}
