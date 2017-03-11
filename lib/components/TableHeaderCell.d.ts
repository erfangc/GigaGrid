/// <reference types="react" />
import * as React from "react";
import { Column } from "../models/ColumnLike";
import { GridComponentProps } from "./GigaGrid";
export interface TableHeaderProps extends GridComponentProps<TableHeaderCell> {
    column: Column;
    tableHeaderClass?: string;
    isFirstColumn?: boolean;
    isLastColumn?: boolean;
    columnNumber: number;
}
export declare class TableHeaderCell extends React.Component<TableHeaderProps, {}> {
    constructor(props: TableHeaderProps);
    renderSortIcon(): JSX.Element;
    render(): JSX.Element;
    renderToolbar(): JSX.Element;
}
