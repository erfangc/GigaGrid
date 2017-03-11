/// <reference types="react" />
import * as React from "react";
import { ClassAttributes } from "react";
import { Column } from "../../models/ColumnLike";
import { Row } from "../../models/Row";
import { GridComponentProps } from "../GigaGrid";
import { CellRenderer } from "./CellRenderer";
export interface CellProps extends GridComponentProps<Cell> {
    row: Row;
    column: Column;
    rowHeight: string;
    isFirstColumn?: boolean;
    columnNumber: number;
}
/**
 * Cell is the base class for constructing a single cell in the table
 * by default, if the cell being rendered is the first cell of a subtotal row,
 * we will render a cell with a +/- button to facilitate expand/collapse of rows
 * otherwise we will render a normal cell with text content
 *
 * Users who wants to provide custom rendering should extend this class and leverage many of its protected methods as
 * building blocks for rendering a cell or revert to default behavior as conditions dictate
 */
export declare class Cell extends React.Component<CellProps & ClassAttributes<Cell>, any> {
    helper: CellRenderer;
    constructor(props: any);
    componentWillReceiveProps(nextProps: CellProps & ClassAttributes<Cell>): void;
    render(): any;
    onSelect(): void;
    calculateContainerStyle(): {
        width: string;
        height: string;
        paddingLeft: string;
    };
    calculateIdentation(): string;
    renderCellWithoutCollapseExpandButton(): JSX.Element;
    renderCellWithCollapseExpandButton(): any | JSX.Element;
    renderContentContainerWithElement(elm: JSX.Element, className?: string): JSX.Element;
    onCollapseToggle(e: React.MouseEvent<any>): void;
}
