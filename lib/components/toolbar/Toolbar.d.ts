/// <reference types="react" />
import * as React from "react";
import "./Toolbar.styl";
import { GridComponentProps } from "../GigaGrid";
/**
 * The job of the toolbar is to dispatch actions to the flux reduce store. It is free to query the state of the grid
 * and its props
 */
export declare class ToolbarToggle extends React.Component<GridComponentProps<ToolbarToggle>, {}> {
    dispatchAction(e: React.SyntheticEvent<any>): void;
    render(): JSX.Element;
}
