/// <reference types="react" />
import { Cell, CellProps } from "./Cell";
import { ClassAttributes } from "react";
import * as React from "react";
/**
 * helper class to render cells
 */
export declare class CellRenderer {
    props: CellProps & ClassAttributes<Cell>;
    constructor(props: CellProps & ClassAttributes<Cell>);
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
