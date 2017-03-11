/// <reference types="react" />
import * as React from "react";
import { ColumnDef } from "../../models/ColumnLike";
import { SortableDataTransfer } from "./SettingsPopover";
export interface SortableItemProps extends React.Props<SortableItem> {
    column: ColumnDef;
    idx: number;
    type: string;
    onClick: () => any;
    onUpdate: (src: SortableDataTransfer, dest: SortableDataTransfer) => any;
}
export declare class SortableItem extends React.Component<SortableItemProps, {}> {
    constructor(props: SortableItemProps);
    onDrop(e: React.DragEvent<any>): void;
    onDragStart(e: React.DragEvent<any>): void;
    onDragOver(e: React.DragEvent<any>): void;
    onDragLeave(e: React.DragEvent<any>): void;
    componentWillReceiveProps(): void;
    render(): JSX.Element;
}
