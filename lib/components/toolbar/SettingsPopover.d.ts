/// <reference types="react" />
import * as React from "react";
import { Column } from "../../models/ColumnLike";
import { GigaAction } from "../../store/GigaStore";
import "./SettingsPopover.styl";
import { AdditionalButton } from "../GigaGrid";
export interface SettingsPopoverProps {
    subtotalBys: Column[];
    columns: Column[];
    onSubmit: (action: GigaAction) => any;
    onDismiss: () => any;
    additionalUserButtons: AdditionalButton[];
}
export interface SettingsPopoverState {
    subtotalBys: Column[];
    columns: Column[];
    activeColumn: Column;
}
export interface SortableDataTransfer {
    type: string;
    colTag: string;
    idx: number;
}
export declare class SettingsPopover extends React.Component<SettingsPopoverProps, SettingsPopoverState> {
    constructor(props: SettingsPopoverProps);
    /**
     * move the src from the `from` list to after the dest column in the `to` list
     * @param from
     * @param to
     * @param src
     * @param dest
     */
    private static swapToAnotherListOfColumns(from, to, src, dest);
    /**
     * moves the src column to after the dest column within the same list
     * @param columns
     * @param src
     * @param dest
     */
    private moveColumn(columns, src, dest);
    /**
     * insert the column represented by the srcColTag to the column represented by the destColTag
     * @param src
     * @param dest
     */
    private updateColumnPosition(src, dest);
    commitColumnUpdates(): void;
    renderSortable(type: string, columns: Column[]): JSX.Element;
    render(): JSX.Element;
    private renderAdditionalUserButtons();
    private renderColumnConfigurer(column?);
}
