import * as React from "react";
import "./Toolbar.styl";
import { GridComponentProps } from "../GigaGrid";
import { GigaAction, GigaActionType } from "../../store/GigaStore";

/**
 * The job of the toolbar is to dispatch actions to the flux reduce store. It is free to query the state of the grid
 * and its props
 */
export class ToolbarToggle extends React.Component<GridComponentProps<ToolbarToggle>, {}> {

    dispatchAction(e: React.SyntheticEvent<any>) {
        e.stopPropagation();
        const action: GigaAction = {
            type: GigaActionType.TOGGLE_SETTINGS_POPOVER
        };
        this.props.dispatcher.dispatch(action);
    }

    render() {
        return (
            <span className="giga-grid-toolbar">
                <i className="fa fa-cogs" onClick={(e) => this.dispatchAction(e)} />
            </span>
        );
    }
}